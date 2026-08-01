# Career Compass

Here's a comprehensive prompt you can use with an AI coding assistant to generate the project. It specifies the architecture, tech stack, folder structure, features, and coding standards.

You are a senior Full Stack Software Engineer and System Architect.

Build a production-ready Government Jobs Portal using React + TypeScript for the frontend and Python (FastAPI) for the backend.

The project must be cleanly organized, scalable, and follow industry best practices.

====================================================
PROJECT NAME
====================================================

GovJobs Portal

====================================================
TECH STACK
====================================================

Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form
- Zod
- Lucide React Icons

Backend
- Python 3.12+
- FastAPI
- SQLAlchemy 2
- Alembic
- Pydantic
- PostgreSQL
- BeautifulSoup4
- Requests
- Playwright
- APScheduler
- python-dotenv
- Uvicorn

Database
- PostgreSQL

====================================================
PROJECT STRUCTURE
====================================================

GovJobsPortal/

    frontend/
    backend/
    README.md
    docker-compose.yml

====================================================
FRONTEND STRUCTURE
====================================================

frontend/

src/

components/

pages/

hooks/

services/

utils/

types/

layouts/

assets/

styles/

router/

App.tsx

main.tsx

====================================================
BACKEND STRUCTURE
====================================================

backend/

app/

api/

models/

schemas/

services/

scrapers/

database/

core/

utils/

middleware/

main.py

requirements.txt

====================================================
BACKEND FEATURES
====================================================

Create REST APIs.

Authentication

JWT Login

JWT Refresh

Register

Forgot Password

Reset Password

User Profile

Role Based Authentication

Roles

Admin

User

Admin Dashboard

Manage jobs

Delete jobs

Run scraper manually

Manage users

View scraper logs

User Features

Search jobs

Save jobs

Bookmark

Filter

Pagination

View details

====================================================
JOB MODEL
====================================================

Fields

id

title

organization

department

state

city

qualification

category

salary

age_limit

application_mode

application_url

notification_pdf

last_date

published_date

description

vacancies

experience

job_type

created_at

updated_at

====================================================
SCRAPERS
====================================================

Create separate scraper class for every website.

Example

scrapers/

ssc.py

upsc.py

rrb.py

ibps.py

isro.py

drdo.py

ongc.py

barc.py

aiims.py

income_tax.py

Each scraper should return

[
{
title,

organization,

salary,

qualification,

last_date,

notification_pdf,

application_url,

description

}
]

Scheduler

Automatically run every 6 hours.

Avoid duplicates.

====================================================
SEARCH API
====================================================

Support

Keyword

State

Qualification

Organization

Salary Range

Last Date

Category

Sorting

Pagination

====================================================
FRONTEND PAGES
====================================================

Home

Latest Jobs

Job Details

Search

Login

Register

Profile

Bookmarks

Admin Dashboard

Admin Jobs

Admin Users

404 Page

====================================================
HOME PAGE
====================================================

Hero Section

Search Bar

Latest Jobs

Top Organizations

Popular Categories

Latest Notifications

Footer

====================================================
JOB CARD
====================================================

Display

Title

Organization

Qualification

Salary

Last Date

State

View Details Button

Bookmark Button

====================================================
JOB DETAILS PAGE
====================================================

Complete description

Salary

Age Limit

Qualification

Selection Process

Application Link

Notification PDF

Bookmark

Share

====================================================
ADMIN DASHBOARD
====================================================

Cards

Total Jobs

Today's Jobs

Users

Scrapers

Recent Jobs

Charts

====================================================
API
====================================================

/api/jobs

/api/jobs/{id}

/api/search

/api/login

/api/register

/api/bookmarks

/api/profile

/api/admin/jobs

/api/admin/users

/api/admin/run-scraper

====================================================
DATABASE
====================================================

Use PostgreSQL

SQLAlchemy ORM

Alembic migrations

Indexes

Constraints

====================================================
ERROR HANDLING
====================================================

Proper HTTP status codes

Validation

Logging

Exception handlers

====================================================
SECURITY
====================================================

JWT

Password Hashing

Rate Limiting

CORS

Environment Variables

====================================================
UI
====================================================

Modern

Responsive

Purple + White theme

Tailwind CSS

Cards

Animations

Loading Skeleton

Dark Mode

====================================================
CODE QUALITY
====================================================

Use TypeScript everywhere.

No any types.

Proper interfaces.

Reusable components.

Hooks.

Service layer.

Repository pattern in backend.

Dependency Injection where appropriate.

====================================================
BONUS FEATURES
====================================================

Infinite scrolling

Job bookmarks

Email notifications

Recently viewed jobs

Job comparison

Export jobs as PDF

Share jobs

SEO

PWA

Caching

====================================================
DELIVERABLES
====================================================

Generate the project step-by-step.

Do NOT skip files.

Create every folder.

Create every source file.

Write complete code.

Never use placeholders like "implement later".

Each response should continue until the entire project is completed.

Whenever a file is created, show its full path before its code.

At the end provide:

1. Installation commands

2. Backend run commands

3. Frontend run commands

4. Database migration commands

5. Environment variables

6. Docker setup

7. Production deployment guide

The final project should be production-ready, modular, scalable, and follow industry best practices.


One suggestion: instead of asking an AI to generate the entire project in one go, ask it to build it module by module (backend first, then frontend, then scrapers, then authentication, etc.). Large, production-ready projects are too big for a single response, and you'll typically get higher-quality, more maintainable code by generating and reviewing one module at a time.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28c3abfb-ffe0-4403-860f-a87465031a95).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
