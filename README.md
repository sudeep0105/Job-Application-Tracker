# JobTrack — Job Application Tracker

**Keep every opportunity moving.** JobTrack is a full-stack web app for organizing job applications, tracking interview progress, and seeing your job search at a glance.

🌐 **Live app:** [job-application-tracker-dusky-kappa.vercel.app](https://job-application-tracker-dusky-kappa.vercel.app)<br>

## About

JobTrack helps job seekers keep company and role details, application stages, dates, salary ranges, job links, and personal notes in one place. Create an account to get a private dashboard for your applications.

## Features

- Account registration and login with JWT authentication.
- BCrypt password hashing.
- Add, view, edit, and delete applications.
- Search applications by company, job title, or location.
- Filter by application status and sort by application date.
- Track **Applied**, **Interview**, **Offer**, and **Rejected** stages.
- Dashboard summary for total applications, interviews, offers, and response rate.
- Application details for company, position, location, employment type, date, salary range (for example, ₹3 LPA – ₹5 LPA), job URL, and notes.
- User-specific data access: each account can access only its own applications.
- Responsive React interface for desktop and mobile.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, JavaScript, HTML, CSS, Vite, Lucide |
| Backend | Java 17+, Spring Boot, Spring Web, Spring Security, Spring Data JPA, Bean Validation |
| Authentication | JWT, BCrypt |
| Database | MySQL |
| Hosting | Vercel (frontend), Railway (API and MySQL) |
| Build tools | npm, Maven |

## Architecture

```text
React app (Vercel)
      │ HTTPS / JSON REST API
      ▼
Spring Boot API (Railway)
      │ Spring Data JPA
      ▼
MySQL (Railway)
```

## Run locally

### Requirements

- Node.js 18 or newer
- Java 17 or newer
- Maven 3.8 or newer
- MySQL 8 or newer

### 1. Create the database

Start MySQL and create the project database:

```sql
CREATE DATABASE jobtrack;
```

The backend uses Hibernate to create and update the application tables during local development.

### 2. Configure and start the backend

The backend reads `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Set your local MySQL credentials in your shell or in an ignored local configuration file; never commit real credentials.

In PowerShell:

```powershell
cd backend
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-local-mysql-password"
mvn spring-boot:run
```

The API starts at `http://localhost:8080`. For anything beyond local development, set `JWT_SECRET` to a private random value of at least 32 bytes.

### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and register an account. The frontend uses `http://localhost:8080/api` by default; set `VITE_API_URL` if your API runs at a different address.

## REST API

All application endpoints require an `Authorization: Bearer <token>` header. Register or log in to receive a token.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Register an account |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |
| `GET` | `/api/applications` | Yes | List your applications |
| `POST` | `/api/applications` | Yes | Create an application |
| `PUT` | `/api/applications/{id}` | Yes | Update your application |
| `DELETE` | `/api/applications/{id}` | Yes | Delete your application |

API status values are `APPLIED`, `INTERVIEW`, `OFFER`, and `REJECTED`.

## Environment variables

| Variable | Used by | Description |
| --- | --- | --- |
| `DB_URL` | Backend | MySQL JDBC connection URL |
| `DB_USERNAME` | Backend | MySQL username |
| `DB_PASSWORD` | Backend | MySQL password |
| `JWT_SECRET` | Backend | Secret used to sign JWTs; use a strong, private value in production |
| `JWT_EXPIRATION_MS` | Backend | Token lifetime in milliseconds; defaults to `86400000` |
| `PORT` | Backend | HTTP port; defaults to `8080` |
| `APP_CORS_ALLOWED_ORIGIN` | Backend | Allowed frontend origin; configure this to the deployed Vercel URL |
| `VITE_API_URL` | Frontend | API base URL, including `/api` |

On Railway, configure database credentials and the JWT secret as service variables. On Vercel, set `VITE_API_URL` to the deployed API URL ending in `/api`. Never put secrets in frontend variables or commit local credentials.

## Repository layout

```text
backend/     Spring Boot REST API and MySQL persistence
frontend/    React application
README.md    Project documentation
```

## License

No license has been specified yet. All rights remain with the repository owner unless a license is added.
