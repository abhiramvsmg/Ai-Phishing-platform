import base64

import httpx

from app.core.config import (
    VIRUSTOTAL_API_KEY,
    GOOGLE_SAFE_BROWSING_API_KEY,
    EXTERNAL_API_TIMEOUT
)

VIRUSTOTAL_URL_SUBMIT = "https://www.virustotal.com/api/v3/urls"
VIRUSTOTAL_URL_REPORT = "https://www.virustotal.com/api/v3/urls/{}"
SAFE_BROWSING_URL = (
    "https://safebrowsing.googleapis.com/v4/threatMatches:find"
)


def _encode_url_id(url: str) -> str:
    # VirusTotal v3 identifies URLs by the base64 of the URL itself,
    # with padding "=" stripped, per their API docs.
    raw = base64.urlsafe_b64encode(url.encode()).decode()
    return raw.strip("=")


def check_virustotal(url: str):
    """
    Looks up a URL on VirusTotal.

    Returns None if no API key is configured, the request fails, or the
    URL has never been scanned before by anyone (VirusTotal only has a
    report once a URL has been submitted at least once). Callers must
    treat None as "no signal", not as "safe".
    """
    if not VIRUSTOTAL_API_KEY:
        return None

    headers = {"x-apikey": VIRUSTOTAL_API_KEY}
    url_id = _encode_url_id(url)

    try:
        with httpx.Client(timeout=EXTERNAL_API_TIMEOUT) as client:
            response = client.get(
                VIRUSTOTAL_URL_REPORT.format(url_id),
                headers=headers
            )

            if response.status_code == 404:
                # Never scanned before — submit it so it's available
                # on a future scan, but we have no result for now.
                client.post(
                    VIRUSTOTAL_URL_SUBMIT,
                    headers=headers,
                    data={"url": url}
                )
                return None

            if response.status_code != 200:
                return None

            data = response.json()
            stats = (
                data.get("data", {})
                    .get("attributes", {})
                    .get("last_analysis_stats", {})
            )

            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            total = sum(stats.values()) if stats else 0

            return {
                "malicious": malicious,
                "suspicious": suspicious,
                "total_engines": total
            }

    except httpx.HTTPError:
        return None


def check_safe_browsing(url: str):
    """
    Looks up a URL against Google's Safe Browsing threat lists.

    Returns None if no API key is configured or the request fails.
    Returns a dict with "flagged": True/False otherwise.
    """
    if not GOOGLE_SAFE_BROWSING_API_KEY:
        return None

    body = {
        "client": {
            "clientId": "ai-phishing-platform",
            "clientVersion": "1.0.0"
        },
        "threatInfo": {
            "threatTypes": [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    try:
        with httpx.Client(timeout=EXTERNAL_API_TIMEOUT) as client:
            response = client.post(
                SAFE_BROWSING_URL,
                params={"key": GOOGLE_SAFE_BROWSING_API_KEY},
                json=body
            )

            if response.status_code != 200:
                return None

            data = response.json()
            matches = data.get("matches", [])

            return {
                "flagged": len(matches) > 0,
                "threat_types": [m.get("threatType") for m in matches]
            }

    except httpx.HTTPError:
        return None