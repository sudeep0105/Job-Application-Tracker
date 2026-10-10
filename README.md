# JobTrack — Job Application Tracker

**Keep every opportunity moving.** JobTrack helps you organize job applications, track interview progress, and see your job search at a glance. Create an account to manage your applications in a private dashboard.

## Features

- Register and log in with JWT authentication and BCrypt password hashing.
- Add, view, edit, and delete job applications.
- Search by company, job title, or location; filter by status and sort by application date.
- Track Applied, Interview, Offer, and Rejected stages.
- View dashboard summaries for applications, interviews, offers, and response rate.
- Save company, position, location, employment type, application date, salary range, job link, and notes.
- Keep application data private to each account.
- Use a responsive interface on desktop and mobile.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, JavaScript, HTML, CSS, Vite, Lucide |
| Backend | Java 17+, Spring Boot, Spring Web, Spring Security, Spring Data JPA, Bean Validation |
| Authentication | JWT, BCrypt |
| Database | MySQL |
| Build tools | npm, Maven |

## How to Run locally

These steps use Windows PowerShell. You will need:

- Git
- Node.js 18 or newer (includes npm)
- Java 17 or newer
- Maven 3.8 or newer
- MySQL 8 or newer

### 1. Clone the repository

Open PowerShell and run:

```powershell
git clone https://github.com/sudeep0105/Job-Application-Tracker.git
cd Job-Application-Tracker
```

### 2. Create the database

Make sure your local MySQL server is running. Open MySQL Workbench or a MySQL client and run:

```sql
CREATE DATABASE jobtrack;
```

The backend creates and updates the application tables when it starts.

### 3. Start the backend

In PowerShell, from the repository folder, run:

```powershell
cd backend
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-local-mysql-password"
mvn spring-boot:run
```

Replace `your-local-mysql-password` with the password for your local MySQL user. If that user has no password, use `$env:DB_PASSWORD = ""`. The API will start at `http://localhost:8080`. Keep this terminal open.

### 4. Start the frontend

Open a second PowerShell window, go to the folder where you cloned the repository, and run:

```powershell
cd Job-Application-Tracker\frontend
npm install
npm run dev
```

### 5. Open the app

Open the local address printed by Vite—usually [http://localhost:5173](http://localhost:5173)—in your browser. Register an account to start tracking applications.
