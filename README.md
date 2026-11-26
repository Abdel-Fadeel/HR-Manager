# HR Manager

A full-stack HR management system for tracking employees, their documents and vacations. It flags expiring IDs, passports and driving licenses before they become a problem, and every report can be exported to PDF.

**Live demo:** https://hr-system-zya6.onrender.com
The demo login is pre-filled (`demo@hrmanager.dev` / `demo1234`). All data in the demo is fake and generated automatically.

> Hosted on Render's free plan, so the first load after a period of inactivity can take up to a minute.

## Features

- **Employees**: create, view, edit and cancel employees, with their ID, passport, sponsor, workplace, contract and driving license details
- **Document uploads**: ID and passport images stored on Cloudinary
- **Vacations**: record leave and returns, with the planned and actual period worked out automatically
- **Reports** (all exportable to PDF):
  - Expired IDs, grouped by workplace
  - ID renewals due in a chosen month
  - Expired passports
  - Drivers and license types
  - Employees by sponsor
  - On duty, on vacation and cancelled employees
- **Users and roles**: admins can create, edit and delete moderator accounts
- **Activity log**: every login, logout and change is recorded with the user and time
- **Authentication**: JWT stored in an HTTP-only cookie, passwords hashed with bcrypt

## Tech Stack

| Layer    | Tools |
| -------- | ----- |
| Frontend | React, TypeScript, Vite, React Router, TanStack Query, Material UI, Tailwind CSS, Formik + Yup, jsPDF |
| Backend  | Node.js, Express, MongoDB + Mongoose, JWT, bcrypt, express-validator, Multer, Cloudinary |
| Hosting  | Render (single service: Express serves the API and the built React app), MongoDB Atlas |

## Project Structure

```
├── client/          React + TypeScript front end (Vite)
├── controllers/     Route handlers
├── middlewares/     Auth, validation, uploads, error handling
├── models/          Mongoose models (Employee, Vacation, Cancelled, User, Activity)
├── routes/          Express routers (/api/v1/...)
├── utils/           JWT, password hashing, query features, demo data seeding
└── server.js        App entry point
```

## API Overview

All routes are under `/api/v1` and need a logged-in user, except login.

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/auth/login` | Log in (sets the auth cookie) |
| GET | `/auth/logout` | Log out |
| GET | `/auth/current-user` | Current user |
| GET | `/auth/activities` | Activity log |
| POST / GET / PATCH / DELETE | `/auth/register`, `/auth/users/:id` | Manage moderators (admin only) |
| GET / POST | `/employees` | List (filter, sort, paginate) / create |
| GET / PATCH / DELETE | `/employees/:id` | Get / update (with image upload) / cancel |
| GET | `/employees/expired-id` | Expired IDs |
| POST | `/employees/id-renewal` | IDs expiring in a given month |
| POST | `/employees/passport` | Expired passports |
| POST | `/employees/driver` | Drivers report |
| POST | `/employees/sponsor` | Employees by sponsor |
| GET | `/employees/status` | Employees by status |
| GET / POST | `/vacations` | List / create vacations |
| GET / PATCH / DELETE | `/vacations/:id` | Get / update / delete a vacation |
| GET | `/cancelled` | Cancelled employees |

## Running Locally

```bash
git clone https://github.com/Abdel-Fadeel/HR-Manager.git
cd HR-Manager
npm run setup-project      # installs server and client dependencies
```

Create a `.env` file in the project root (see `.env.example`):

```env
NODE_ENV=development
PORT=5100
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=1d

# Image uploads (optional)
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=

# Fill an empty database with fake demo data on start (optional)
SEED_DEMO_DATA=true
DEMO_EMAIL=demo@hrmanager.dev
DEMO_PASSWORD=demo1234
```

Then start both the API and the client:

```bash
npm run dev
```

The client runs on http://localhost:5173 and the API on http://localhost:5100.

To pre-fill the login form (as the live demo does), set `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` when building the client.

## Deployment

The app is deployed as one Render web service:

- **Build command:** `npm run setup-production-app`
- **Start command:** `node server.js`
- **Environment:** the variables above, with `NODE_ENV=production`

## Author

**Abdel-Fadeel Hamdy** · [GitHub](https://github.com/Abdel-Fadeel)
