from app.services.threat_intel_service import (
    check_virustotal,
    check_safe_browsing
)

# --- URL keyword heuristic (original M1 list, kept as-is) ---------------
URL_SUSPICIOUS_WORDS = [
    "login",
    "verify",
    "security",
    "update",
    "bank",
    "account",
    "signin",
    "confirm"
]

URL_SUSPICIOUS_TLDS = [
    ".xyz",
    ".top"
]

# --- Email/text keyword heuristic (original M1 lists, kept as-is) -------
EMAIL_SUSPICIOUS_WORDS = [
    "verify",
    "click here",
    "urgent",
    "bank",
    "password",
    "account suspended",
    "login"
]

TEXT_SUSPICIOUS_WORDS = [
    "click here",
    "urgent",
    "verify",
    "password",
    "bank",
    "otp",
    "prize",
    "won",
    "lottery",
    "account suspended"
]


def _keyword_score_url(url: str):
    url_lower = url.lower()
    matches = [w for w in URL_SUSPICIOUS_WORDS if w in url_lower]
    score = len(matches) * 20

    tld_matches = [t for t in URL_SUSPICIOUS_TLDS if t in url_lower]
    score += len(tld_matches) * 30

    return min(score, 100), matches + tld_matches


def _keyword_score_email(text: str):
    text_lower = text.lower()
    matches = [w for w in EMAIL_SUSPICIOUS_WORDS if w in text_lower]
    score = len(matches) * 20
    return min(score, 100), matches


def _keyword_score_text(text: str):
    text_lower = text.lower()
    matches = [w for w in TEXT_SUSPICIOUS_WORDS if w in text_lower]
    score = len(matches) * 20
    return min(score, 100), matches


def _classify_url(score: int):
    # Matches the exact thresholds and labels M1's dashboard queries
    # already filter on (ScanHistory.result == "PHISHING"/"SAFE" and
    # risk_level == "HIGH") in scan_repository.py. Do not rename these
    # strings without updating that file too.
    if score >= 70:
        return "PHISHING", "HIGH"
    if score >= 40:
        return "SUSPICIOUS", "MEDIUM"
    return "SAFE", "LOW"


def _classify_text(score: int):
    # Matches get_risk_distribution in scan_repository.py, which
    # counts all four levels including CRITICAL for email/text scans.
    if score >= 80:
        return "PHISHING", "CRITICAL"
    if score >= 60:
        return "PHISHING", "HIGH"
    if score >= 30:
        return "SUSPICIOUS", "MEDIUM"
    return "SAFE", "LOW"


def analyze_url(url: str):
    """
    Combines three independent signals into one risk score:
      1. VirusTotal    - up to 50 points, scaled by how many of the
                          engines that scanned this URL flag it
      2. Safe Browsing - 40 points if Google's threat list flags it
      3. Keyword heuristic - M1's original word/TLD list, capped so
         it nudges the score rather than dominating it once a real
         API has responded

    If neither API has a key configured (or both fail/time out), the
    result falls back to keyword-only scoring so the platform keeps
    working end-to-end with no external dependency required.
    """
    reasons = []
    score = 0

    vt_result = check_virustotal(url)
    if vt_result is not None:
        total = vt_result["total_engines"]
        flagged = vt_result["malicious"] + vt_result["suspicious"]

        if total > 0:
            vt_points = min(int((flagged / total) * 50), 50)
            score += vt_points

            if flagged > 0:
                reasons.append(
                    f"VirusTotal: {flagged}/{total} security engines "
                    f"flagged this URL"
                )

    sb_result = check_safe_browsing(url)
    if sb_result is not None and sb_result["flagged"]:
        score += 40
        threat_list = ", ".join(sb_result["threat_types"])
        reasons.append(
            f"Google Safe Browsing flagged this URL ({threat_list})"
        )

    keyword_score, keyword_matches = _keyword_score_url(url)
    apis_responded = vt_result is not None or sb_result is not None
    if apis_responded:
        score += min(keyword_score, 20)
    else:
        score += keyword_score

    if keyword_matches:
        reasons.append(
            f"Suspicious pattern(s) in URL: {', '.join(keyword_matches)}"
        )

    score = min(score, 100)
    result, risk_level = _classify_url(score)

    return {
        "result": result,
        "risk_score": score,
        "risk_level": risk_level,
        "details": " | ".join(reasons) if reasons else "No indicators found"
    }


def analyze_email(email_text: str):
    """
    Keyword-only scoring, identical logic to M1's original version.
    VirusTotal and Safe Browsing are URL/domain reputation services,
    not email-body analyzers, so they are not called here. (A future
    upgrade could extract any links found inside the email and run
    them through analyze_url separately.)
    """
    score, matches = _keyword_score_email(email_text)
    result, risk_level = _classify_text(score)

    return {
        "result": result,
        "risk_score": score,
        "risk_level": risk_level
    }


def analyze_text(text: str):
    """
    Keyword-only scoring, identical logic to M1's original version.
    Kept as a separate function since scan_service.py calls it
    separately from analyze_email for generic text scans.
    """
    score, matches = _keyword_score_text(text)
    result, risk_level = _classify_text(score)

    return {
        "result": result,
        "risk_score": score,
        "risk_level": risk_level
    }