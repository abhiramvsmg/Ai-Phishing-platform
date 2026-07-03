from pathlib import Path
import pandas as pd

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet

from app.models.report import Report


REPORT_FOLDER = Path(
    "app/exports/reports"
)

REPORT_FOLDER.mkdir(
    parents=True,
    exist_ok=True
)


def export_report_pdf(
        report: Report
):
    file_name = (
        f"report_{report.id}.pdf"
    )

    file_path = (
        REPORT_FOLDER / file_name
    )

    document = SimpleDocTemplate(
        str(file_path)
    )

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "AI Phishing Detection Report",
            styles["Title"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            f"Report ID: {report.id}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Report Type: {report.report_type}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Created At: {report.created_at}",
            styles["Normal"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            report.details,
            styles["Normal"]
        )
    )

    document.build(
        content
    )

    return str(file_path)


def export_report_csv(
        report: Report
):
    file_name = (
        f"report_{report.id}.csv"
    )

    file_path = (
        REPORT_FOLDER / file_name
    )

    data = {
        "report_id": [report.id],
        "report_type": [
            report.report_type
        ],
        "details": [
            report.details
        ],
        "created_at": [
            report.created_at
        ]
    }

    df = pd.DataFrame(
        data
    )

    df.to_csv(
        file_path,
        index=False
    )

    return str(file_path)