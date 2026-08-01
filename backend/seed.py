"""Seed the database with an admin account and sample vacancies.

Usage:  python seed.py
"""
from datetime import date, timedelta

from app.core.config import settings
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models import Job, User, UserRole
from app.repositories.job_repository import JobRepository
from app.repositories.user_repository import UserRepository
from app.utils.text import parse_salary_range

SAMPLE_JOBS = [
    {
        "title": "Combined Graduate Level Examination 2026",
        "organization": "Staff Selection Commission",
        "department": "Ministry of Personnel",
        "state": "All India",
        "city": "New Delhi",
        "qualification": "Bachelor's Degree",
        "category": "Central Government",
        "salary": "Rs. 25,500 - 81,100 per month",
        "age_limit": "18 - 32 years",
        "application_mode": "Online",
        "application_url": "https://ssc.gov.in",
        "notification_pdf": "https://ssc.gov.in/notice/cgl-2026.pdf",
        "vacancies": 17727,
        "experience": "Fresher",
        "job_type": "Permanent",
        "selection_process": "Tier I, Tier II, Document Verification",
        "description": "Recruitment to Group B and Group C posts across central government ministries and departments.",
        "source": "ssc",
    },
    {
        "title": "Civil Services Preliminary Examination 2026",
        "organization": "Union Public Service Commission",
        "department": "Government of India",
        "state": "All India",
        "city": "New Delhi",
        "qualification": "Bachelor's Degree",
        "category": "Central Government",
        "salary": "Rs. 56,100 - 2,50,000 per month",
        "age_limit": "21 - 32 years",
        "application_mode": "Online",
        "application_url": "https://upsc.gov.in",
        "vacancies": 1056,
        "experience": "Fresher",
        "job_type": "Permanent",
        "selection_process": "Prelims, Mains, Interview",
        "description": "Recruitment to IAS, IPS, IFS and other allied central services.",
        "source": "upsc",
    },
    {
        "title": "RRB NTPC Graduate Level Recruitment",
        "organization": "Railway Recruitment Board",
        "department": "Indian Railways",
        "state": "All India",
        "city": "Multiple",
        "qualification": "Bachelor's Degree",
        "category": "Railway",
        "salary": "Rs. 19,900 - 63,200 per month",
        "age_limit": "18 - 33 years",
        "application_mode": "Online",
        "application_url": "https://indianrailways.gov.in",
        "vacancies": 11558,
        "job_type": "Permanent",
        "selection_process": "CBT 1, CBT 2, Typing Test, Document Verification",
        "description": "Non-technical popular categories recruitment across all railway zones.",
        "source": "rrb",
    },
    {
        "title": "Probationary Officer Recruitment 2026",
        "organization": "Institute of Banking Personnel Selection",
        "department": "Public Sector Banks",
        "state": "All India",
        "city": "Mumbai",
        "qualification": "Bachelor's Degree",
        "category": "Banking",
        "salary": "Rs. 36,000 - 63,840 per month",
        "age_limit": "20 - 30 years",
        "application_mode": "Online",
        "application_url": "https://www.ibps.in",
        "vacancies": 4455,
        "job_type": "Permanent",
        "selection_process": "Prelims, Mains, Interview",
        "description": "Common recruitment process for probationary officers in participating public sector banks.",
        "source": "ibps",
    },
    {
        "title": "Scientist / Engineer SC Recruitment",
        "organization": "Indian Space Research Organisation",
        "department": "Department of Space",
        "state": "Karnataka",
        "city": "Bengaluru",
        "qualification": "BE / B.Tech in Electronics, Mechanical or Computer Science",
        "category": "Engineering",
        "salary": "Rs. 56,100 - 1,77,500 per month",
        "age_limit": "18 - 28 years",
        "application_mode": "Online",
        "application_url": "https://www.isro.gov.in",
        "vacancies": 320,
        "job_type": "Permanent",
        "selection_process": "Written Test and Interview",
        "description": "Engineering positions across ISRO centres working on launch vehicle and satellite programmes.",
        "source": "isro",
    },
    {
        "title": "Senior Technical Assistant B",
        "organization": "Defence Research and Development Organisation",
        "department": "Ministry of Defence",
        "state": "All India",
        "city": "Multiple",
        "qualification": "Diploma / B.Sc in relevant discipline",
        "category": "Defence",
        "salary": "Rs. 35,400 - 1,12,400 per month",
        "age_limit": "18 - 28 years",
        "application_mode": "Online",
        "application_url": "https://www.drdo.gov.in",
        "vacancies": 1061,
        "job_type": "Permanent",
        "selection_process": "Tier I and Tier II examination",
        "description": "Technical cadre recruitment across DRDO laboratories and establishments.",
        "source": "drdo",
    },
    {
        "title": "Graduate Trainee Engineer",
        "organization": "Oil and Natural Gas Corporation",
        "department": "Ministry of Petroleum",
        "state": "All India",
        "city": "Dehradun",
        "qualification": "BE / B.Tech with 60% marks",
        "category": "PSU",
        "salary": "Rs. 60,000 - 1,80,000 per month",
        "age_limit": "18 - 30 years",
        "application_mode": "Online",
        "application_url": "https://www.ongcindia.com",
        "vacancies": 922,
        "job_type": "Permanent",
        "selection_process": "GATE score and interview",
        "description": "Recruitment of graduate trainee engineers through GATE scores for ONGC work centres.",
        "source": "ongc",
    },
    {
        "title": "Nursing Officer Recruitment Common Eligibility Test",
        "organization": "All India Institute of Medical Sciences",
        "department": "Ministry of Health",
        "state": "Delhi",
        "city": "New Delhi",
        "qualification": "B.Sc Nursing",
        "category": "Medical",
        "salary": "Rs. 44,900 - 1,42,400 per month",
        "age_limit": "18 - 30 years",
        "application_mode": "Online",
        "application_url": "https://www.aiims.edu",
        "vacancies": 3055,
        "job_type": "Permanent",
        "selection_process": "Computer based test",
        "description": "Nursing officer recruitment across AIIMS and central government hospitals.",
        "source": "aiims",
    },
]


def run() -> None:
    db = SessionLocal()
    try:
        users = UserRepository(db)
        if not users.get_by_email(settings.FIRST_ADMIN_EMAIL):
            users.add(
                User(
                    full_name="Portal Administrator",
                    email=settings.FIRST_ADMIN_EMAIL.lower(),
                    hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
                    role=UserRole.ADMIN,
                )
            )
            print(f"Created admin: {settings.FIRST_ADMIN_EMAIL}")

        jobs = JobRepository(db)
        created = 0
        for index, data in enumerate(SAMPLE_JOBS):
            payload = dict(data)
            payload["last_date"] = date.today() + timedelta(days=10 + index * 4)
            payload["published_date"] = date.today() - timedelta(days=index)
            payload["salary_min"], payload["salary_max"] = parse_salary_range(payload.get("salary"))
            if jobs.find_duplicate(payload["title"], payload["organization"], payload["last_date"]):
                continue
            jobs.add(Job(**payload))
            created += 1

        db.commit()
        print(f"Seeded {created} jobs.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
