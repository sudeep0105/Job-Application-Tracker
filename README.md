# JobTrack

JobTrack keeps your job applications, interview stages, and next steps together. It includes a React dashboard and a Spring Boot REST API backed by MySQL.

## Features

- Register and sign in with BCrypt-encrypted passwords and JWT access tokens.
- Create, view, edit, delete, search, and filter job applications.
- Track company, position, location, employment type, status, date, salary, posting URL, and notes.
- See application, interview, offer, and response-rate totals on the dashboard.
- Keep each user's application data isolated to their authenticated account.

## Requirements

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8+

## Run locally

1. Start MySQL and create a database, or allow the configured connection to create `jobtrack`:

   ```sql
   CREATE DATABASE jobtrack;
   ```

2. Start the API:

   ```powershell
   cd backend
   $env:DB_USERNAME = "root"
   $env:DB_PASSWORD = "your-mysql-password"
   mvn spring-boot:run
   ```

   The API runs at `http://localhost:8080`. Connection settings can be overridden with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Set `JWT_SECRET` to a private, random value of at least 32 bytes outside local development.

3. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`, then create an account. To point the frontend at a different API, set `VITE_API_URL` (defaults to `http://localhost:8080/api`).

## REST API

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Sign in and receive a JWT |
| `GET` | `/api/applications` | Bearer JWT | List the signed-in user's applications |
| `POST` | `/api/applications` | Bearer JWT | Create an application |
| `PUT` | `/api/applications/{id}` | Bearer JWT | Update an application |
| `DELETE` | `/api/applications/{id}` | Bearer JWT | Delete an application |

Application statuses are `APPLIED`, `INTERVIEW`, `OFFER`, and `REJECTED` in API requests. Include the returned token as `Authorization: Bearer <token>` on protected endpoints.

## Configuration

The API reads configuration from environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `DB_URL` | Local MySQL `jobtrack` database | JDBC connection URL |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | Empty | MySQL password |
| `JWT_SECRET` | Development-only placeholder | HMAC signing secret; replace for deployments |
| `JWT_EXPIRATION_MS` | `86400000` | Token lifetime in milliseconds |
| `PORT` | `8080` | API port |
| `VITE_API_URL` | `http://localhost:8080/api` | Frontend API base URL |

Hibernate updates the schema automatically for local development. For production, use managed schema migrations and HTTPS, configure a strong secret, and store secrets outside source control.
