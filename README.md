# Nurse Care — Trained Nurses for Care at Home

> **IMPORTANT NOTICE: PROTOTYPE DEMONSTRATION ONLY**  
> **Nurse Care is an interactive functional prototype.** All patient enquiry data, nurse applications, reviews, and clinical documents are managed in local client application state (`localStorage`). No real medical prescriptions are processed, and this platform is **NOT** connected to an emergency dispatch service. In medical emergencies, always call **112** or transport the patient to an acute care hospital.

---

## Overview

Nurse Care is a responsive website prototype for booking trained, certified home nursing care. It features a complete public-facing portal for patient families, a hidden nurse onboarding portal, and a password-protected administrative operations console.

### Key Highlights

- **Design System**: Calm, trustworthy healthcare aesthetic with primary teal (`#0f8672`, dark `#0e6b5c`, light `#effaf8`), white backgrounds, rounded cards, soft shadows, and accessible WCAG AA contrast.
- **No Blog, No Patient Login, No Online Payments**: Strictly focused on clinical enquiry triage, nurse verification, and coordinator operations.
- **Public Website Routes**:
  - `/` (Home): Hero with Enquire Now and WhatsApp buttons, services preview cards, 3-step "How It Works", approved customer reviews (text, photo, and video placeholders), FAQ accordion, emergency disclaimer.
  - `/about-us` (About Us): Mission, 4-tier nurse selection process, regional NCR coverage.
  - `/services` (Services): 5 specialized care sections (Elderly Care, Post-Surgery & Wound Care, Injections & IV Care, Patient Attendant Care, Short-Term Visits) with descriptions and individual clinical FAQs.
  - `/contact-us` (Contact Us): Helpline telephone, verified email, central office address, instant WhatsApp link.
  - `/enquiry` (Enquiry): Form with name, phone, email, service, city/area, preferred date, message. Client validation (10–15 digit phone, 2+ char name, no past dates) and anti-spam honeypot. Adds enquiry to admin list with stage `NEW` and triggers simulated admin email alert.
  - `/feedbacks` (Feedbacks): Review submission with 1–5 stars, message, optional photo/video upload with preview. Creates review with status `PENDING`.
  - `/sitemap`, `/terms-and-conditions`, `/privacy-policy`: Legal documentation with prominent "Test Content" banners.
  - Floating WhatsApp button on every public page generated from `settings.whatsappNumber`.
- **Hidden Nurse Onboarding Route**:
  - `/join/nurse-7k2x`: Dedicated unlinked applicant intake capturing full name, phone, email, city, qualification, experience, and government ID (Aadhaar, PAN, Voter ID, Passport, Other). Submits nurse with status `PENDING`.
- **Admin Panel (`/admin`)**:
  - Demo login credentials: `admin@nursecare.org` / `admin123`.
  - **Dashboard**: Metric cards for all 5 enquiry stages, pending nurses count, pending reviews count, and recent incoming bookings.
  - **Enquiries**: Full table with live search (name, phone, area), stage filtering, and sorting. Detailed view drawer with timeline history, private clinical notes, stage status selector, active-only nurse assignment, edit/delete with confirm dialogs.
  - **Documents**: Upload and preview PDF, JPG, and PNG verification files (validated &le; 10 MB) strictly for `CONFIRMED` or `COMPLETED` enquiries.
  - **Nurses**: Full CRUD, status filter (`PENDING`, `ACTIVE`, `INACTIVE`), search, masked government ID in roster (`•••• •••• 7842`), and unmasked ID on detail view.
  - **Reviews**: Approve, reject, edit, delete, and manual review creation. Only `APPROVED` reviews appear publicly on the Home page.
  - **Settings**: Live configuration for site name, logo upload with preview, contact phone, email, address, WhatsApp number, social links, and default SEO title/description. Updates public site instantly.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7 (`react-router-dom`)
- **Icons**: Lucide React
- **Persistence**: Reactive React Context with `localStorage` fallback and seeded realistic clinical data.
