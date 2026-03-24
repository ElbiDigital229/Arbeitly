# Arbeitly – Super Admin Portal (Updated)

---

## 1. Overview

The Super Admin Portal is the complete control layer of Arbeitly.

**Core Principle: Admin defines system → System executes → Employees operate → Candidates receive service**

Controls:
- Monetisation (Plans + Transactions)
- Operations (Employees + Candidates)
- Intelligence (AI Prompts + Language Routing)
- Automation (Per-Candidate Scraper)
- Configuration (Onboarding Questions)
- Performance (Analytics)

Single Super Admin login — no multi-admin.

---

## 2. Sidebar Navigation (12 items)

1. Dashboard
2. Plans
3. Candidates
4. Employees
5. Transactions
6. AI Configuration
7. Scraper & Matching
8. Onboarding Configuration
9. Analytics
10. Audit Log
11. System Settings
12. Profile

---

## 3. Module: Dashboard

### Overview Metrics
- Total Candidates — split: Free vs Paid
- Total Employees
- Total Applications Sent (platform-wide)
- Total Revenue
- Active Plans
- Conversion Rate (free → paid)

### Alerts & Insights
- Candidates nearing quota exhaustion
- Employees with low performance
- Scraper issues or failures

### Quick Lists
- Recently signed-up candidates
- Active plans summary

---

## 4. Module: Plans

### 4.1 Plan Fields
- Plan Name
- Price
- Price Suffix (e.g. "+ 8.5% SUCCESS FEE")
- Billing Description
- Display Price (short label)
- Total Label (checkout)
- **Application Limit** (e.g. 200) — quota per candidate on this plan
- Features list (included / excluded toggles)
- Most Popular flag

### 4.2 Controls
- Create / Edit / Delete
- **Activate / Deactivate** — deactivated plans are not shown on pricing page

### 4.3 Plan Analytics
- Users per plan
- Revenue per plan

---

## 5. Module: Candidates

### 5.1 Candidate List
Columns: Name, Email, Plan, Assigned Employee, Sign-up Date, Status, Quota Usage

### 5.2 Candidate Detail View
Admin can view:
- Personal details
- Plan details + **quota usage (e.g. 45 / 200)**
- Onboarding responses
- Files & CVs
- Applications list
- Assigned employee

### 5.3 Actions
- Assign / reassign employee
- Reset password
- Upgrade / downgrade plan
- Adjust application quota (bump +50, +100, or set custom)
- View as Employee (opens candidate in employee portal view)

---

## 6. Module: Employees

### 6.1 Employee List
Columns: Name, Email, Assigned candidates count, Status, Created date

### 6.2 Employee Detail View (Expandable)
- List of assigned candidates with quota usage per candidate
- Performance metrics summary
- Activity log

### 6.3 Actions
- Create employee (name, email, password, status)
- Edit employee
- Delete employee
- Assign / reassign candidates (checkbox grid)
- Activate / deactivate

---

## 7. Module: Transactions

### 7.1 Fields per Transaction
- Candidate Name
- Plan
- Amount
- Date
- Payment Method (Stripe / Manual)
- Status (Paid / Pending / Refunded)

### 7.2 Capabilities
- View all transactions
- Manual transaction entry
- Stripe-integrated payments display
- Process refunds / cancellations
- Revenue metrics: Total revenue, Revenue per plan

---

## 8. Module: AI Configuration (Core IP Layer)

This module controls the entire intelligence layer of the platform.

### 8.1 LLM Setup
- Select provider: Claude, Gemini, or future models
- Store API keys securely

### 8.2 Prompt Management

Four global prompt types — all run automatically by the system:

#### CV Enhancement Prompt
Used when employee clicks "Enhance CV". Applied as the base instruction for AI improvement.

#### Job Tailoring Prompt
Used when generating job-specific CV variants. Combined with job description.

#### Cover Letter Prompt
Used for per-job cover letter generation.

#### Job Matching Prompt
Controls AI matching score calculation for Job Discovery.

**Final prompt logic for CV actions:**
`Admin Global Prompt + Job Context + Employee Custom Input`

### 8.3 Prompt Versioning
- Every prompt edit creates a new version
- Full change history maintained
- New version takes effect **immediately** on all future actions
- Prior completed actions are not affected

### 8.4 Language Routing Rules (Critical)

Admin defines global rules for how CVs are selected per job language:

| Job Language State | Action |
|---|---|
| English only | Use candidate's English (EN) CV |
| German only | Use German (DE) CV — auto-generate via AI translation if none exists |
| English + German accepted | Auto-generate German (DE) version and use it |

**Detection:** System AI parses job description to detect language requirement.

**Auto-generation:** When a German CV does not exist:
1. System takes best-matched English CV
2. AI translates it into German using admin-defined rules
3. Saves as a new DE-tagged version in the candidate's Files
4. Links to the application automatically

These rules apply **globally** to all candidates. Not configurable per candidate.

---

## 9. Module: Scraper & Matching

### 9.1 Model
Jobs are scraped **per candidate** — not a global pool. Each candidate has their own scraper configuration.

### 9.2 Per-Candidate Scraper Setup
Admin opens a candidate record and configures:
- **Sources**: LinkedIn, Indeed, StepStone, Xing (checkboxes)
- **Target Roles**: keywords / job titles
- **Locations**: cities or regions in Germany
- **Industry**: target sectors
- **Job Type**: Full-time, Part-time, Remote
- **Additional Keywords**

### 9.3 Cadence
Admin sets the scraping frequency per candidate:
- Daily
- Every 48 hours
- Weekly
- Custom interval

On save, the scraper activates and runs automatically on the set schedule.

### 9.4 Behaviour
- Initial run populates the candidate's Job Discovery queue immediately
- Subsequent runs append new jobs
- Duplicate detection runs at ingestion — same job from multiple sources is flagged once
- Matched jobs automatically appear in employee's Job Discovery tab for that candidate

### 9.5 Job Pipeline View
Admin can view:
- All scraped jobs per candidate
- Ingestion timestamps
- Duplicate flags
- Match scores

---

## 10. Module: Onboarding Configuration

### 10.1 Purpose
Admin fully controls what questions are asked — nothing is hardcoded.

### 10.2 Paid Onboarding Questions
- Add questions
- Edit questions
- Delete questions
- Reorder (drag & drop)
- Set as required or optional

### 10.3 Free Marketing Questions
Same controls — admin builds the free sign-up questionnaire dynamically.

### 10.4 Question Types
- Text input
- Dropdown (single select)
- Multi-select

---

## 11. Module: Analytics

### 11.1 Platform Analytics
- Applications sent over time
- Conversion rate (free → paid)
- Interview rate platform-wide
- Revenue over time

### 11.2 Employee Analytics (Per Employee)
- Applications completed
- Interview rate
- Acceptance rate
- Rejection rate
- Documents generated
- Performance ranking vs other employees

### 11.3 Candidate Analytics
- Progress per candidate
- Quota consumption rate
- Success rates

---

## 12. Module: Audit Log

Two-panel layout:
- Left: user list (candidates + employees), sorted by activity count
- Right: full activity feed for selected user

### Tracks
- CV creation, edits, enhancements
- Application additions, status changes, deletions
- FAQ additions, edits, approvals, overrides
- Prompt updates
- Assignments and reassignments
- Scraper activations

### Metadata per entry
- Action (human-readable label)
- Actor (who performed it)
- Subject (who it affected)
- Timestamp

---

## 13. Module: System Settings

### General
- Platform name
- Default settings

### Quota Rules
- Quota deduction trigger: **status = Applied only** (configurable here)
- Default quota for new plans

### Permissions (Future)
- Role-based controls

---

## 14. Module: Profile

- Admin name, email
- Change password
- Activity log (system-level actions)

---

## 15. Core Business Rules

| Rule | Detail |
|---|---|
| One employee per candidate | Managed by admin — reassignment preserves all history |
| Quota belongs to candidate | Consumed when employee marks status = "Applied" |
| Candidate self-apps unlimited | Self-tracking never counts toward quota |
| Prompt updates are immediate | Affect all future AI actions globally |
| Scraping is per-candidate | Admin configures per candidate, not globally |
| Language routing is global | Admin sets rules once, applies to all candidates |
| Single Super Admin | One login, full platform control |

---

## 16. Summary

| Module | Purpose |
|---|---|
| Dashboard | Platform health + alerts |
| Plans | Subscription management with application limits |
| Candidates | Full candidate registry + quota + assignment |
| Employees | Team management + performance overview |
| Transactions | Revenue tracking (Stripe + manual) |
| AI Configuration | Prompts, LLM setup, language routing rules |
| Scraper & Matching | Per-candidate job pipeline configuration |
| Onboarding Config | Dynamic question builder (paid + free) |
| Analytics | Platform + employee performance |
| Audit Log | Per-user activity history |
| System Settings | Quota rules + platform config |
| Profile | Admin account management |
