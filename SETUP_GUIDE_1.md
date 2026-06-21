# MediCare SaaS — Complete Setup Guide

This walks through every step from unzipping the project to having it live on the internet,
including exactly which files to open and which lines to edit. No code logic needs to change
anywhere — every external service is wired through environment variables in two files:

- `backend/.env`
- `frontend/.env`

That's it. Those are the only two files you'll edit.

---

## Step 1 — Extract and install

```bash
unzip medicare-saas.zip
cd medicare-saas
```

You'll set up the backend and frontend separately, plus one Supabase project that both connect to.

---

## Step 2 — Create your Supabase project (the database)

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name, password (for the DB — you won't need this password day-to-day), and region.
3. Wait ~2 minutes for it to provision.
4. Open **SQL Editor** (left sidebar) → **New query**.
5. Open `database/schema.sql` from the project, copy its entire contents, paste into the editor, click **Run**.
   - You should see "Success. No rows returned." This creates all 6 tables (`users`, `patients`, `doctors`, `appointments`, `consultation_notes`, `notifications`).
6. Go to **Project Settings** (gear icon) → **API**. You need two values from this page for the next step:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **service_role key** (under "Project API keys") — a long string. **Not** the `anon` `public` key — the backend needs the service role key to bypass row-level security.

Keep this tab open, you'll copy-paste these in Step 3.

---

## Step 3 — Backend setup (`backend/.env`)

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` in your editor. Here's exactly what each line means and where the value comes from:

```env
# ===== Server =====
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173        # leave as-is for local dev

# ===== JWT =====
JWT_SECRET=replace_with_a_long_random_secret    # ← CHANGE THIS
JWT_EXPIRES_IN=7d

# ===== Supabase =====
SUPABASE_URL=https://your-project-ref.supabase.co     # ← paste from Step 2
SUPABASE_SERVICE_KEY=your_service_role_key            # ← paste from Step 2

# ===== Email (optional for local dev) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com          # ← see Step 4
SMTP_PASS=your_app_password             # ← see Step 4
EMAIL_FROM="MediCare SaaS <no-reply@medicare.com>"

# ===== Twilio WhatsApp (optional for local dev) =====
TWILIO_ACCOUNT_SID=your_twilio_account_sid    # ← see Step 5
TWILIO_AUTH_TOKEN=your_twilio_auth_token      # ← see Step 5
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886    # ← see Step 5
```

**For `JWT_SECRET`**, any random string works — generate one quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste the output as the value.

**Email and WhatsApp are optional.** If you leave those as placeholders, the app still works —
appointments get booked, notifications get stored and shown in the bell icon — it just won't send
the external email/WhatsApp message (you'll see a warning in the terminal, not a crash). Set these
up whenever you're ready using Steps 4 and 5 below, or skip them entirely for a portfolio demo.

Once `.env` is filled in, start the server:
```bash
npm run dev
```
You should see `MediCare SaaS API listening on port 5000`. Visit `http://localhost:5000/api/health`
in a browser — you should get `{"success":true,"status":"ok"}`.

---

## Step 4 — Email setup (Nodemailer via Gmail)

Skip this if you don't need real emails sent yet.

1. You need a Gmail account with **2-Step Verification** turned on (Google Account → Security).
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Create an app password (name it "MediCare"). Google gives you a 16-character code.
4. In `backend/.env`:
   - `SMTP_USER` = your full Gmail address
   - `SMTP_PASS` = the 16-character app password (not your regular Gmail password)
5. Restart the backend (`npm run dev`) for the change to take effect.

Using a different provider (SendGrid, Mailgun, etc.)? Just change `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
and `SMTP_PASS` to match their SMTP credentials — the code doesn't need to change.

---

## Step 5 — WhatsApp setup (Twilio Sandbox)

Skip this if you don't need WhatsApp notifications yet.

1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio) (free trial, no card needed for sandbox).
2. In the Twilio Console, go to **Messaging → Try it out → Send a WhatsApp message**. This activates your sandbox and shows a number like `+1 415 523 8886` plus a join code (e.g. "join able-tiger").
3. From your own WhatsApp, send that join code to that number — this links your personal number to the sandbox so it can receive test messages.
4. Back in the Twilio Console, go to **Account → API keys & tokens** (or the dashboard home) and copy:
   - **Account SID**
   - **Auth Token**
5. In `backend/.env`:
   - `TWILIO_ACCOUNT_SID` = the Account SID
   - `TWILIO_AUTH_TOKEN` = the Auth Token
   - `TWILIO_WHATSAPP_FROM` = `whatsapp:+14155238886` (the sandbox number, with the `whatsapp:` prefix kept exactly like that)
6. Restart the backend.

Note: in sandbox mode, Twilio can only message numbers that have joined your sandbox (Step 3). For
production WhatsApp messaging to any number, you'd apply for a Twilio WhatsApp Business sender —
that's a longer approval process you'd only need post-launch, not for development/demo.

---

## Step 6 — Frontend setup (`frontend/.env`)

```bash
cd ../frontend
npm install
cp .env.example .env
```

Open `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Leave this as-is for local development — it just needs to match wherever your backend is running.
Run it:
```bash
npm run dev
```
Visit `http://localhost:5173`.

---

## Step 7 — Test it end-to-end

1. Go to `/register`, select **Doctor**, fill in name/email/password/specialization/department, submit.
2. Log out, register again as **Patient**.
3. From the patient dashboard, click **Book Appointment**, pick the doctor you just created, a date, and a time slot.
4. Check the bell icon (top right) — you should see a new notification.
5. If you configured Step 4/5, check your email inbox / WhatsApp for the booking confirmation.
6. Log out, register as **Doctor** again using the same doctor account... actually log back in as that doctor, go to the Doctor Dashboard, you should see the appointment under "Today" or "Upcoming" — try **Confirm**, **Mark complete**, and adding a **Note**.
7. Register an **Admin** account and check `/admin/dashboard` for the stats chart and activity feed.
8. Register a **Reception** account and try registering a walk-in patient — it should issue a token number.

---

## Step 8 — Deploy the backend to Render

1. Push the `medicare-saas` folder to a GitHub repo.
2. On [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Under **Environment**, add every variable from your local `backend/.env` (same names, same values) — Render's dashboard has an "Add Environment Variable" button for each one, or a bulk paste option.
7. Set `CLIENT_URL` to your future Vercel URL (you can update this after Step 9 once you know it).
8. Deploy. Render gives you a URL like `https://medicare-backend.onrender.com`. Test it: visit `https://medicare-backend.onrender.com/api/health`.

---

## Step 9 — Deploy the frontend to Vercel

1. On [vercel.com](https://vercel.com) → **Add New → Project** → import the same GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Vercel auto-detects Vite (build command `npm run build`, output directory `dist`) — no change needed.
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://medicare-backend.onrender.com/api` (your Render URL from Step 8, with `/api` appended)
5. Deploy. Vercel gives you a URL like `https://medicare-saas.vercel.app`.

---

## Step 10 — Connect the two live URLs

1. Go back to Render → your backend service → **Environment** → update `CLIENT_URL` to your real Vercel URL (`https://medicare-saas.vercel.app`, no trailing slash).
2. Redeploy the backend (Render usually does this automatically when you change an env var; if not, click **Manual Deploy**).
3. Done — your frontend and backend now allow each other's requests (CORS) and point at each other correctly.

---

## Quick reference: every place you add a key

| What | File | Variable |
|---|---|---|
| Random secret you generate | `backend/.env` | `JWT_SECRET` |
| Supabase Project URL | `backend/.env` | `SUPABASE_URL` |
| Supabase service_role key | `backend/.env` | `SUPABASE_SERVICE_KEY` |
| Gmail address | `backend/.env` | `SMTP_USER` |
| Gmail App Password | `backend/.env` | `SMTP_PASS` |
| Twilio Account SID | `backend/.env` | `TWILIO_ACCOUNT_SID` |
| Twilio Auth Token | `backend/.env` | `TWILIO_AUTH_TOKEN` |
| Twilio sandbox WhatsApp number | `backend/.env` | `TWILIO_WHATSAPP_FROM` |
| Your live frontend URL | `backend/.env` (and Render dashboard) | `CLIENT_URL` |
| Your live backend URL + `/api` | `frontend/.env` (and Vercel dashboard) | `VITE_API_URL` |

No other files need editing — the code reads all of these dynamically. You never hardcode a URL or
key anywhere in the source.

---

## Troubleshooting

**"Invalid API key" or Supabase errors on every request** — double check you copied the
`service_role` key, not the `anon` key, and that there's no trailing space pasted into `.env`.

**Frontend loads but API calls fail with a CORS error** — `CLIENT_URL` in `backend/.env` (or
Render) doesn't match your actual frontend URL exactly (check `http` vs `https`, trailing slash).

**Register/login works but nothing shows on the dashboard** — open the browser console; if you see
401 errors, your token may have expired or `JWT_SECRET` changed since you logged in — log out and
back in.

**Emails/WhatsApp not arriving but no errors shown** — check the backend terminal/Render logs for a
line starting with `[emailService]` or `[whatsappService]` — they log the specific reason (missing
credentials, bad recipient, etc.) without crashing the request.
