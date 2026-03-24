# Arbeitly – Employee Portal (Updated)

---

## 1. Overview

The Employee Portal is the execution engine of Arbeitly.

**Core Principle: AI prepares → Employee executes → Candidate validates**

Employees:
- Manage their assigned candidates
- Apply to jobs externally on behalf of candidates using AI-generated materials
- Track and update application progress
- Maintain CV and cover letter libraries
- Collaborate with candidates on FAQ interview preparation

---

## 2. Access
Employee logs in at `/employee/login` using credentials created by the Super Admin.

---

## 3. Sidebar Navigation

1. **Candidates** — list of all assigned candidates (home screen)
2. **Files (Global)** — employee's personal file workspace
3. **Analytics** — own performance metrics
4. **Profile**

---

## 4. Module: Candidates

### 4.1 Candidate List
Displays only assigned candidates. Each row shows:
- Name
- Plan
- **Application quota usage** (e.g. 45 / 200)
- Status

### 4.2 Candidate Detail View — Tabs
Clicking any candidate opens their full workspace:

1. Overview
2. CV
3. Files
4. Account
5. Job Discovery
6. Applications
7. FAQ

---

## 5. Tab: Overview

Displays:
- Personal details from profile
- Plan details
- Full onboarding responses
- Preferences

### Top-Level Stats
- Sign-up date
- Applications sent (quota consumed)
- Interviews
- Accepted
- Rejected
- **Plan quota usage** (e.g. 5 / 200)

---

## 6. Tab: CV

### 6.1 CV Sources
- Original (uploaded by candidate)
- AI-enhanced (system, using admin global prompt)
- Employee-created versions
- Job-specific variants (including language variants)

### 6.2 CV Editor
Rich text editor — employee can edit content, customise structure, optimise per role/industry.

### 6.3 Enhance CV
Button: **Enhance CV**

Uses admin-defined global CV Enhancement Prompt automatically.
Output: New version saved to tree (e.g. V2).

### 6.4 Employee Custom Prompt
Employee can add a custom instruction on top of the global prompt:
`Final prompt = Admin Global Prompt + Job Context + Employee Input`

### 6.5 Versioning System
- V1 → Original
- V2 → AI Enhanced
- V3+ → Employee Enhanced
- Dynamic → Job-specific / Language-specific

### 6.6 Language Tags
Every CV version is tagged **EN** or **DE**.

### 6.7 Templates & Export
Employee exports CVs using Template A, B, or C (Modern, Classic, Minimal).
Export creates a PDF and saves to candidate Files.

---

## 7. Tab: Files (Candidate-Level)

Stores all files for this specific candidate:
- CVs (all versions + variants)
- Cover letters
- Supporting documents uploaded by employee

Each file shows:
- Name
- Source: Candidate / Employee / System
- Language: EN / DE
- Linked job (if applicable)
- Timestamp

**All files here are visible to the candidate.**

---

## 8. Tab: Account (Candidate Credentials)

### 8.1 Purpose
Stores the candidate's dummy application credentials used by the employee to apply to jobs externally.

### 8.2 Stored Data
- **Dummy application email** (created by candidate during onboarding)
- **Dummy password**

### 8.3 Behaviour
- Read-only display
- Easily accessible at a glance — employee needs these every time they apply

### Critical Use
Employee uses these credentials to log in to job portals (LinkedIn, Indeed, StepStone, etc.) and submit applications on behalf of the candidate.

---

## 9. Tab: Job Discovery

### 9.1 Source
Jobs are populated from the **per-candidate scraper** configured and activated by the Super Admin. Results are automatically fetched on the admin-set cadence.

### 9.2 Job List View
Each job shows:
- Job title, company, location
- Tags (job type, source platform)
- **AI Matching Score** — based on candidate's onboarding profile and admin-defined matching prompt
- Language requirement (English only / German only / Both)
- Generated CV assigned (auto-selected by language routing rules)
- Generated cover letter

### 9.3 AI Matching Score
Calculated using admin-defined Job Matching Prompt against candidate's:
- CV content
- Onboarding profile
- Preferences

### 9.4 Filters & Search
- Search by job title or company
- Filter by match score (All / High / Medium)
- Filter by location, role type

### 9.5 Duplicate Detection
System detects and flags duplicate jobs. Actioning one clears the duplicate group.

### 9.6 Job Detail View
Expands to show:
- Full job description
- **Auto-selected CV** (based on language routing rules)
- **Generated cover letter** (per job)
- Application link

### 9.7 Add to Applications
Employee clicks **Add to Applications** → job enters the Applications queue as "To Apply" with CV + cover letter pre-linked.

---

## 10. Tab: Applications

### 10.1 Visibility Rule — Critical
Employee sees **ONLY**:
- Jobs they added themselves
- System-generated jobs

Employee does **NOT** see:
- Applications the candidate added themselves

### 10.2 Kanban Workflow
Columns: To Apply / Applied / Interview / Accepted / Rejected

Standard workflow:
1. Job added to "To Apply" (from Job Discovery or manually)
2. Employee opens job, reviews CV + cover letter
3. Employee applies externally using candidate credentials
4. Employee marks as **Applied** → **quota consumed**
5. Status updated through Interview → Accepted/Rejected as process progresses

### 10.3 Quota Logic
- Quota is consumed **only when status = "Applied"**
- Sitting in "To Apply" does not count
- When quota exhausted → employee is blocked from marking further applications as "Applied" until Super Admin increases the quota

### 10.4 List & Kanban Views
Both views available. List view supports search, filter by status, CSV import/export.

---

## 11. Tab: FAQ

### 11.1 Purpose
Employee prepares interview Q&A pairs for the candidate.

### 11.2 Creation
Employee adds: Question + Suggested Answer
New items status: **Pending Approval**

### 11.3 Employee Can
- Add Q&A items
- Edit items (unless candidate has locked with their own answer)
- Delete any item (including candidate-locked)
- **Approve** items (e.g. after confirming with candidate externally via WhatsApp)
- Unverify (revert approved back to pending)

### 11.4 Candidate Actions
Candidate can approve, change their own answer (locks item), or unverify.

### 11.5 Versioning & History
Each FAQ item has a full edit history — who created it, when it was edited, when approved, if candidate overrode it.

---

## 12. Module: Files (Global — Employee Personal Workspace)

### 12.1 Purpose
Employee's own private file workspace. **Not visible to candidates.**

### 12.2 Contents
- CV templates
- Prompt experiments / reference drafts
- Reference documents
- Any files not yet linked to a specific candidate

### 12.3 Rule
These files are not shared unless explicitly attached to a candidate.

---

## 13. Module: Analytics

Employee's own performance dashboard:

### Overview Metrics
- Total Applications Completed (status = Applied)
- Total Candidates Managed
- Total Documents Generated

### Performance Metrics
- Interview Rate
- Acceptance Rate
- Rejection Rate

### Time-Based Metrics
- Applications over time
- Daily / weekly trends

### Status Breakdown
By current application status across all candidates.

---

## 14. Module: Profile

- Name, email, creation date
- Change password
- Activity Log: CV edits, applications processed, FAQ actions

---

## 15. Ownership & Audit

System tracks:
- Who created/edited each CV
- Who created/edited each FAQ item
- Who applied to each job (employee or system attribution)

Purpose: accountability, safe reassignment, full traceability.

---

## 16. Candidate Reassignment

When Super Admin reassigns a candidate to a different employee:
- All history preserved
- Ownership attribution maintained
- New employee gets full context of prior work

---

## 17. Summary

The Employee Portal is a candidate-centric execution system where each candidate has their own pipeline. AI prepares everything, the employee executes efficiently, and the candidate collaborates when needed.

| Tool | Purpose |
|---|---|
| Candidate List | Overview of all assigned candidates with quota usage |
| CV Tab | Build, enhance, and version CVs (EN + DE) |
| Files Tab | All candidate documents with source + language tags |
| Account Tab | Candidate's dummy credentials for external applications |
| Job Discovery | AI-matched jobs from per-candidate scraper |
| Applications Tab | Employee's execution queue (not shared with candidate self-adds) |
| FAQ Tab | Interview prep Q&As with candidate approval workflow |
| Global Files | Employee's private document workspace |
| Analytics | Own performance metrics |
