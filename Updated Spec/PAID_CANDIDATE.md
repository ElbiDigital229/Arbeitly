# Arbeitly – Paid Candidate (Updated)

---

## 1. Overview

The Paid Plan transforms Arbeitly into a hybrid job application platform.

**Key Principle: Paid Plan = Free Plan + Managed Execution Layer**

- Candidate continues using all free tools (CV builder, tracker)
- Employee simultaneously applies to jobs on their behalf
- AI generates and language-adapts all application materials
- Everything is visible in one place

---

## 2. Entry & Payment Flow

1. Candidate selects Paid Plan on Pricing Page
2. Completes registration: Full Name, Email, Password
3. Redirected to Payment Page (Stripe)
4. On payment success: account created, plan assigned, marked as Paid
5. Proceeds to Onboarding

---

## 3. Onboarding Flow (Critical)

### 3.1 Purpose
Collects structured data used for:
- Job matching
- AI CV and cover letter generation
- Employee execution

### 3.2 Dummy Application Credentials
During onboarding, candidate creates:
- **Dummy application email** — a separate email address used by the employee to apply to jobs externally on their behalf
- **Dummy password** — password for that email account

These credentials are stored securely and visible to the assigned employee in the Account tab.

### 3.3 Onboarding Questions
Fully dynamic — configured by Super Admin. Covers:
- Personal details, contact info
- Current role, employer, field, experience, salary, notice period
- Education, skills, certifications
- Career goals, target roles, industries, location, salary expectations
- German language level, driving licence
- Work history in Germany, relocation preference

Mandatory before dashboard access. Stored in profile.

---

## 4. Sidebar Navigation

Same structure as Free, with paid sections unlocked:

1. **CV**
2. **Files**
3. **Applications**
4. **FAQ** *(paid only)*
5. **Profile**

---

## 5. Module: CV (Same as Free + Paid Unlocks)

### 5.1 CV Sources Visible to Candidate
- CVs they uploaded or created themselves
- CVs created/enhanced by their employee
- AI-generated job-specific variants (including auto-translated DE versions)

All sources visible in Files.

### 5.2 AI Enhancement
- AI enhancement is **employee-only** — candidate cannot trigger it themselves
- Results appear automatically in candidate's Files when employee runs enhancement

### 5.3 CV Versioning
- V1 → Original upload
- V2 → AI Enhanced (by employee)
- V3+ → Employee refined
- Dynamic → Job-specific, language-specific variants

Every CV version has a **language tag** (EN or DE).

---

## 6. Module: Files (Unified Storage)

### 6.1 Contents (Paid Users)
- Candidate-created CVs
- Employee-created CVs
- AI-generated CVs (including language variants)
- Cover letters (generated per job by employee)

### 6.2 File Metadata
Each file shows:
- Name
- Source: Candidate / Employee / System
- Language: EN / DE
- Linked job (if job-specific)
- Timestamp

### 6.3 Key Rule
Any file created by employee or system is automatically visible to the candidate.

---

## 7. Module: Applications (Hybrid Experience)

### 7.1 Application Sources
Applications can be created by:
1. **Candidate** — self-tracking (unlimited, never counts toward quota)
2. **Employee** — managed execution (counts toward quota when marked "Applied")
3. **System** — AI/scraper pipeline (counts toward quota when marked "Applied")

### 7.2 What Candidate Sees
The candidate sees ALL applications — their own, employee-added, and system-generated.

Employee-added entries are clearly labelled "Added by [Employee Name]".
System entries are labelled "System".

### 7.3 Read Rules
- Candidate can edit and delete their own entries
- Candidate **cannot** edit or delete employee-added or system-generated entries
- Status dropdown is disabled on employee/system entries

### 7.4 Application Fields
- Job Title
- Company
- Job URL
- Notes
- Salary (optional)
- CV Used (linked from Files)
- **Cover Letter Used** (linked from Files)
- Status
- Application Date
- Source (Self / Employee / System)
- Added By (name)

### 7.5 Views
Table View (full structured list) and Kanban View (To Apply / Applied / Interview / Accepted / Rejected).

### 7.6 CSV Import & Export
Same as free — candidate can import and export their own applications.

### 7.7 Stats Display
Dashboard shows combined stats:
- Applications used / total quota (e.g. 45 / 200)
- Breakdown by source (self / employee / system)
- In progress, interviews, accepted, rejected

---

## 8. Module: FAQ (Interview Preparation)

### 8.1 Purpose
Employee prepares interview Q&A pairs for the candidate. Candidate reviews and approves.

### 8.2 Workflow
1. Employee adds question + suggested answer → status: **Pending Approval**
2. Candidate sees it and takes one of three actions:
   - **Approve** — accepts the answer as-is
   - **Change Answer** — submits their own preferred answer (auto-approves, locks the item)
   - **Unverify** — reverts an approved item back to pending

### 8.3 Locking
If candidate submits their own answer, the item is **locked**. Employee can see this but cannot edit — they can only delete and recreate if needed.

### 8.4 Stats Bar
Shows: Total items / Approved / Pending approval.

### 8.5 Activity History
Each FAQ item has a collapsible activity log (who created, edited, approved, overrode).

---

## 9. Module: Profile

### 9.1 Account Information
- Update name, email, password

### 9.2 Plan Info & Quota
- Current Plan name
- **Application quota usage: e.g. "45 / 200 used"**
- Applications remaining
- Option to purchase add-on quota if exhausted

### 9.3 Onboarding Data (Read-Only)
Candidate can view their full onboarding profile — the data their employee is working from.

### 9.4 Activity Log
Full chronological audit of all actions on their account — by themselves, their employee, and the system.

---

## 10. Candidate–Employee Relationship

| Employee Does | Candidate Does |
|---|---|
| Applies to matched jobs externally | Tracks and views all progress |
| Creates and enhances CVs | Views and downloads files |
| Generates cover letters per job | Reviews and uses files |
| Prepares FAQ interview answers | Approves, overrides, or unverifies answers |
| Discovers and queues jobs | Sees them appear in Applications |
| Updates application statuses | Adds their own applications freely |

---

## 11. Summary

The Paid Plan is a hybrid system. The candidate continues using their tools while the employee runs a parallel execution lane. Everything is shared, attributed, and visible in one place.
