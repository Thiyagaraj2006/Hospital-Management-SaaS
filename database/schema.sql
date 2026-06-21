-- ============================================================
-- MediCare SaaS - Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New Query)
-- ============================================================

-- Extension for UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS  (base identity for patient / doctor / admin / reception)
-- ============================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,                -- bcrypt hash
  role text not null check (role in ('patient', 'doctor', 'admin', 'reception')),
  created_at timestamptz default now()
);

-- ============================================================
-- PATIENTS  (extra profile data for role = patient)
-- ============================================================
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  phone text,
  age int,
  gender text,
  blood_group text,
  address text
);

-- ============================================================
-- DOCTORS  (extra profile data for role = doctor)
-- ============================================================
create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  specialization text,
  department text,
  experience int,
  phone text,
  photo_url text
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  doctor_id uuid references doctors(id) on delete cascade,
  appointment_date date not null,
  appointment_time text not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  consultation_status text default 'not_started' check (consultation_status in ('not_started', 'in_progress', 'completed')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  source text default 'online' check (source in ('online', 'walk_in')),
  token_number int,
  created_at timestamptz default now()
);

-- ============================================================
-- CONSULTATION NOTES
-- ============================================================
create table if not exists consultation_notes (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete cascade,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_appointments_patient on appointments(patient_id);
create index if not exists idx_appointments_doctor on appointments(doctor_id);
create index if not exists idx_appointments_date on appointments(appointment_date);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_patients_user on patients(user_id);
create index if not exists idx_doctors_user on doctors(user_id);

-- ============================================================
-- SEED DATA (optional - sample departments via doctors, comment out if not needed)
-- ============================================================
-- Sample admin login (password = 'Admin@123', hash generated with bcryptjs, replace before using)
-- insert into users (name, email, password, role) values
--   ('System Admin', 'admin@medicare.com', '$2a$10$replace_with_real_bcrypt_hash', 'admin');

-- ============================================================
-- ROW LEVEL SECURITY
-- The backend uses the Supabase service_role key (server-side only), which
-- bypasses RLS. RLS is left disabled here because all data access is
-- mediated by the Express API with its own JWT + role checks. If you ever
-- expose the anon/public key directly to the browser, enable RLS and add
-- policies before doing so.
-- ============================================================
