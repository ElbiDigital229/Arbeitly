# Arbeitly — Free Candidate

## Who They Are
A free candidate is a self-service user. They signed up without paying, using the platform as a CV builder and application tracker. They have no assigned employee and manage everything themselves. The free plan is the entry point into the Arbeitly ecosystem — the conversion goal is to move them to a paid plan.

---

## How They Sign Up
1. Visit the landing page → click **"Get Started"** (goes to `/register?plan=free`)
2. Fill: Full Name, Email, Password, Confirm Password
3. Account created → redirected to `/onboarding/simple`
4. Simple onboarding collects: current field, preferred location, how they heard about Arbeitly
5. Redirected to `/candidate/applications`

---

## What They Can Access

| Page | Route | Access |
|---|---|---|
| Applications | `/candidate/applications` | ✅ Full |
| CV Builder | `/candidate/cv` | ✅ Full |
| Files | `/candidate/files` | ✅ Full |
| Profile & Settings | `/candidate/profile` | ✅ Full |
| Analytics | `/candidate/analytics` | ✅ Full |
| Onboarding | `/candidate/onboarding` | ❌ Hidden (paid only) |
| FAQ | `/candidate/faq` | ❌ Hidden (paid only) |
| Billing | `/candidate/billing` | ❌ Hidden (paid only) |

---

## Core Flows

### Applications
- Add, edit, delete job applications manually
- Track status: To Apply → Applied → Interview → Accepted / Rejected
- Toggle between Kanban board and list view
- Search by job title or company
- Filter by status
- All data stored in `localStorage` under key `arbeitly_apps_{candidateId}`

### CV Builder
- Upload existing PDF → auto-extraction populates editor with name, email, experience, education, skills
- Or write from scratch
- Choose template: Modern, Classic, Minimal
- Choose language: EN or DE
- Live preview renders as HTML in real time
- Save named versions (e.g. "v1 – Tech Focus")
- Create language or style variants per version
- Download any version as PDF

### Files
- Tree view of all CV versions and variants
- Preview and download individual files
- Source badges: Uploaded, AI Generated, Human Reviewed

### Profile & Settings
- View current plan (Free), quota usage, account email
- Edit name, email
- Change password (requires current password)
- View activity log of own actions

### Upgrade
- From profile or pricing page, select a paid plan
- Redirected through payment flow → onboarding → paid candidate portal

---

## Application Quota
- Free candidates have a **limited quota** (set by super admin via pricing plans)
- Progress bar in profile shows: `X used / Y total`
- When quota is hit, cannot add more applications (UI blocks submit)
- Upgrading to paid plan increases quota

---

## How a Free Candidate Affects Other Users

### → Super Admin
- Appears in Candidates table at `/superadmin/customers` with **"Free"** badge
- Super admin can see: name, email, sign-up date, plan, status
- Super admin can view their basic onboarding answers (field, location, how they heard)
- Super admin can edit their plan — upgrading them to paid here changes their portal access immediately
- Super admin can track how many free vs paid candidates exist on the Overview KPI cards

### → Employee
- A free candidate is **not assigned to any employee** by default
- Free candidates do **not appear** in an employee's "My Candidates" list
- If a super admin manually assigns a free candidate to an employee (via the Employees page), the employee can view them — but the candidate won't have full onboarding data for job discovery
- Free candidates have limited value to employees due to missing onboarding profile

---

## Edge Cases
- Free candidate tries to access `/candidate/faq` → sidebar item not shown, direct URL should redirect or show upgrade prompt
- Free candidate hits quota limit → Add Application button disabled, prompt to upgrade shown
- Free candidate uploads a non-PDF file → error toast, no extraction
- Free candidate has no experience entries in CV → preview renders without breaking
- Free candidate completes simple onboarding but leaves all fields blank → still proceeds to portal
- Super admin upgrades free candidate to paid → FAQ, Onboarding, Billing tabs appear on next page load without requiring re-login
