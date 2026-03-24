# Arbeitly — Employee

## Who They Are
An employee is an Arbeitly team member (job advisor/recruiter) who manages a portfolio of paid candidates. They apply to jobs on behalf of candidates using AI-generated materials, manage the application pipeline, handle FAQ preparation, and monitor progress. Employees do not self-register — they are created by the super admin and given credentials directly.

---

## How They Access the Platform
1. Super admin creates employee account at `/superadmin/employees` (name, email, password, status)
2. Employee navigates to `/employee/login`
3. Enters credentials → redirected to `/employee/internal` (Overview)
4. Super admin must assign candidates to them before they appear in "My Candidates"

---

## What They Can Access

| Page | Route | Description |
|---|---|---|
| Overview | `/employee/internal` | Workload stats, recent activity |
| My Candidates | `/employee/internal/candidates` | List of assigned candidates |
| Candidate Detail | `/employee/portal/candidates/:id` | Full candidate management (9 tabs) |
| Settings | `/employee/settings` | Account settings |

---

## Core Flows

### Overview Page
- Stats cards: Total Candidates assigned, Active Applications, Documents Generated, Success Rate
- Recent activity feed: latest CV optimisations, applications submitted, cover letters generated, interviews scheduled, new candidates registered

### My Candidates
- Table showing all assigned candidates with:
  - Name, email, field, location
  - Total apps, interview count, accepted count
- Search by name, email, or field
- Toggle between list and grid view
- Click any row → opens full Candidate Detail view

---

## Candidate Detail — 9 Tabs

### 1. Profile Tab
- Read-only view of candidate's personal details
- Contact info: name, email, phone, LinkedIn, address
- Plan, status, account creation date
- Quick stats: total apps, interviews, accepted, quota usage

### 2. Onboarding Tab
- Full read-only view of candidate's onboarding answers
- Sections: Work, Education, Skills, Career Goals, Germany Info
- This is the source of truth for job matching and document generation

### 3. Applications Tab
- View all applications for this candidate
- **Employee can only see and edit applications they added** (platform-sourced); not self-added by candidate
- Add new application on behalf of candidate:
  - Job title, company, URL, status, date, salary, contact person, next action, job description, CV used
  - Application marked as `source: "platform"`, `addedById`, `addedByName`
  - Candidate sees it with **unseen badge** in their portal
- Edit and delete own applications
- Change application status → moving to "Applied" decrements candidate quota
- Switch between list view and Kanban board view
- Import applications via CSV (with column validation)
- Export applications to CSV

### 4. CV Tab
- View candidate's existing CV versions and variants
- Upload a new CV on behalf of the candidate
- Generate AI-enhanced CV version (based on onboarding data)

### 5. Cover Letter Tab
- View existing cover letters
- Generate a new cover letter using candidate's profile data

### 6. Files Tab
- All uploaded and generated documents for this candidate
- Files added via Job Discovery auto-appear here
- Upload additional files (e.g. references, certificates)
- Delete files

### 7. Account Tab (Read-only)
- Candidate's job application account credentials (if set)
- Email and password used when applying externally
- Marked as "Authorised by candidate"

### 8. Job Discovery Tab
- Jobs auto-generated based on candidate's onboarding data:
  - Target roles, preferred location, salary expectations, years of experience, German level, field
- Each job card shows:
  - Match score (colour coded: green 80%+, yellow 60–79%, orange below 60%)
  - Job type (Full-time / Remote)
  - Company, location, salary range
  - Match reasons (e.g. "Role matches target position", "Salary within target range")
  - Source (LinkedIn / Indeed / StepStone / Xing)
- **Filter by match score**: All / 80%+ / 50–79%
- **Skip job**: Select reason (Irrelevant role, Low quality listing, Duplicate, Visa/location mismatch, Salary below target, Other) → job greyed out
- **Restore skipped jobs**: Toggle "Show skipped (N)" → Restore button per job
- **Refresh**: Fetches 3 new jobs, stacked on top, max 20 kept
- **Add to Queue**:
  1. Creates a new application in candidate's tracker (`status: "to-apply"`)
  2. Auto-generates Tailored CV for this specific job
  3. Auto-generates Cover Letter for this specific job
  4. Saves both as files to candidate's Files tab
  5. Toast confirms: "CV & CL saved to Files"

- **Details panel** (click "Details" on any job):
  - 3 tabs: Job Description | Tailored CV | Cover Letter
  - **Tailored CV**: Full CV formatted for this specific role and company, using candidate's real data (name, contact, skills, experience, education, salary expectations, German level)
  - **Cover Letter**: Personalised letter addressed to company, referencing role, candidate's background, career goal, German level, availability
  - **Copy** button: copies full text to clipboard
  - **Save to Files** button: saves document to candidate's Files tab (deduplicates by filename)

### 9. FAQ Tab
- Create Q&A pairs (common interview questions, background queries about the candidate)
- Edit answers
- Approve answers → candidate sees "Approved" badge
- Delete FAQ items
- Each item has a full activity log (created, updated, approved, overridden by candidate)
- **Cannot edit answers locked by the candidate** (candidate-override lock)

---

## How an Employee Affects Other Users

### → Candidate (Paid)
- Applications added by employee appear in candidate's portal with unseen badge
- Badge disappears when candidate opens their Applications tab
- FAQ items created by employee appear in candidate's FAQ tab for review
- Files generated via Job Discovery appear in candidate's Files tab
- Status changes (especially to "Applied") decrement candidate's quota — visible in their profile
- All employee activity is logged and shown in candidate's activity log on their Profile tab

### → Super Admin
- Employee's assigned candidates and quota usage visible on the Employees page (expanded row)
- Employee's activity log visible in the expanded row (last 30 actions)
- Super admin sees employee load: number of assigned candidates and applications per candidate in the Overview page
- If employee is performing poorly (low "Applied" count, high "To Apply" backlog), super admin can see this from the candidate detail view
- Super admin can delete an employee account — their assigned candidates become unassigned

---

## Status Change & Quota Rule
- When employee changes an application status **to "Applied"** (from any other status):
  1. `applicationsUsed` counter increments by 1 on the `CandidateAssignment` record
  2. Audit log entry created: `application_status_changed` with detail "Marked Applied: [job] at [company]"
  3. This is visible to super admin in the candidate detail page
- If moving **away from "Applied"** back to another status: quota is **not refunded** (by design — the application was submitted)

---

## Edge Cases
- Employee tries to access a candidate not assigned to them (via direct URL) → "You don't have access to this candidate" message shown
- Candidate has no onboarding data → Job Discovery generates generic jobs with placeholder data; tailored CV/CL will be minimal
- Employee adds application for candidate who has hit their quota → application can still be added to "To Apply" status; quota only triggers on "Applied"
- Employee creates duplicate FAQ item (same question) → currently allowed; no deduplication
- Employee session expires mid-session → next protected action redirects to `/employee/login`
- Employee is deleted by super admin while they have a session open → next page navigation should return 404 or redirect to login
- Multiple employees try to work on the same candidate simultaneously → last write wins (localStorage-based, no locking)
