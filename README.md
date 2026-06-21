# MediCare SaaS – Hospital Management Platform

A full-stack hospital management platform with three roles (Patient, Doctor, Admin) plus a bonus
Reception module — built with React + Vite + Tailwind on the frontend and Node.js + Express +
Supabase (PostgreSQL) on the backend.

```
medicare-saas/
├── backend/        Express API (auth, appointments, admin, notifications, reception)
├── frontend/        React app (public site, auth, patient/doctor/admin/reception dashboards)
└── database/
    └── schema.sql    Supabase PostgreSQL schema — run this first
```

## 1. Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project
- (Optional, for notifications) an SMTP account for Nodemailer and a [Twilio](https://www.twilio.com) account with WhatsApp Sandbox enabled

## 2. Set up the database

1. Create a new Supabase project.
2. Open **SQL Editor** in the Supabase dashboard and run the contents of `database/schema.sql`.
3. From **Project Settings → API**, copy your **Project URL** and **service_role key** (not the anon key — the backend needs the service role to bypass RLS).

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `JWT_SECRET` | Any long random string |
| `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Your email provider (e.g. a Gmail [App Password](https://myaccount.google.com/apppasswords)) |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_FROM` | Twilio Console → WhatsApp Sandbox |
| `CLIENT_URL` | Your frontend URL, for CORS (e.g. `http://localhost:5173`) |

Run it:

```bash
npm run dev      # nodemon, auto-restart
# or
npm start
```

The API boots on `http://localhost:5000`. Email/WhatsApp credentials are optional for local
development — if they're missing, the app logs a warning and skips sending instead of crashing.

## 4. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` (defaults to `http://localhost:5000/api`).

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 5. Creating your first accounts

There's no seed data — register through the UI:

1. Go to `/register`, choose **Doctor**, fill in specialization/department, and create an account.
2. Register again as **Patient** to book an appointment with that doctor.
3. Register as **Admin** to see hospital-wide stats, or **Reception** to register walk-ins.

(In a real deployment you'd typically provision Admin/Reception accounts manually rather than via
public self-registration — the role selector is left open here for demo/evaluation convenience.)

## 6. Deployment

**Frontend → Vercel**
1. Push this repo to GitHub.
2. Import the repo in Vercel, set the project root to `frontend/`.
3. Add environment variable `VITE_API_URL` = your deployed backend URL + `/api`.
4. Deploy. Vercel auto-detects the Vite build (`npm run build`, output `dist/`).

**Backend → Render**
1. New Web Service → connect the repo, root directory `backend/`.
2. Build command: `npm install`. Start command: `npm start`.
3. Add all variables from `.env.example` under Render's Environment tab.
4. Set `CLIENT_URL` to your deployed Vercel URL so CORS allows it.

**Database → Supabase**
Already hosted — no extra deployment step beyond the schema you ran in step 2.

After deploying, update `VITE_API_URL` on Vercel and `CLIENT_URL` on Render to point at each
other's live URLs, then redeploy both.

## 7. API reference

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/doctors` | Public |
| POST | `/api/appointments/book` | Patient |
| GET | `/api/appointments/patient/:id` | Patient/Admin/Reception |
| GET | `/api/appointments/doctor/:id` | Doctor/Admin/Reception |
| PATCH | `/api/appointments/:id/status` | Doctor/Admin/Reception |
| GET / PUT | `/api/patients/me` | Patient |
| GET | `/api/doctors/me/dashboard` | Doctor |
| GET | `/api/doctors/me/patients` | Doctor |
| POST / GET | `/api/doctors/appointments/:id/notes` | Doctor |
| PATCH | `/api/doctors/appointments/:id/complete` | Doctor |
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/activity` | Admin |
| GET | `/api/notifications` | Authenticated |
| PATCH | `/api/notifications/:id/read` | Authenticated |
| POST | `/api/reception/walkin` | Reception/Admin |
| GET | `/api/reception/tokens/today` | Reception/Admin/Doctor |

## 8. Notes on scope

- The AI Symptom Checker is a lightweight client-side keyword matcher (chest pain → Cardiology,
  etc.) as specced — it's a triage hint, not a diagnostic model.
- Email and WhatsApp sends are best-effort: if SMTP/Twilio credentials aren't configured, the
  notification is still stored in the database and shown in-app, just not delivered externally.
- Dark mode preference and JWT session persist in `localStorage`.
