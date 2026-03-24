# Arbeitly – Free Candidate (Updated)

---

## 1. Overview

The Free Plan is the freemium acquisition layer. It gives candidates a genuinely useful self-service toolkit — CV builder and application tracker — while creating natural upgrade pressure through feature limits.

**Free Plan = Self-service job toolkit**

---

## 2. Entry & Sign-Up Flow

1. Candidate lands on Pricing Page
2. Selects Free Plan
3. Completes registration: Full Name, Email, Password
4. Answers marketing questionnaire (configured dynamically by Super Admin)
5. Lands on their dashboard

### Marketing Questionnaire
Questions are configured by the Super Admin — not hardcoded. Default examples:
- Are you currently a German resident?
- Where did you hear about Arbeitly?
- How are you currently managing your job search?

Responses stored in Candidate Profile (marketing data section).

---

## 3. Sidebar Navigation

1. **CV**
2. **Files**
3. **Applications**
4. **Profile**

Upgrade Plan CTA visible persistently in the sidebar or top nav.

---

## 4. Module: CV Builder

### 4.1 Entry State
User sees two options:
- Upload existing CV
- Create CV from scratch

### 4.2 CV Upload & Parsing
When user uploads a CV (PDF):
- System extracts structured data (experience, education, skills)
- Populates the visual editor with parsed content

### 4.3 CV Editor
Rich text editor with editable sections:
- Personal Info
- Experience
- Education
- Skills

### 4.4 Templates
Three visual templates available (A, B, C — Modern, Classic, Minimal)
User selects template before export.

### 4.5 Export Flow
1. Select template
2. Name the file
3. Export as PDF
4. Saved automatically to Files module

### 4.6 Export Limits
- Export limit is set by the **Super Admin** (not hardcoded)
- Counter shown: e.g. "3 / 10 exports used"
- When limit reached → "Upgrade to export more" prompt

### 4.7 AI Enhancement (Locked)
Button: "Enhance with AI"
- Disabled for free users
- Clicking redirects to Pricing Page

---

## 5. Module: Files

### 5.1 Purpose
Central storage for all CV exports.

### 5.2 Contents (Free Users)
- Only their own exported CVs
- No employee-created files (those are paid only)

### 5.3 File Metadata
Each file shows:
- File name
- Template used
- Language tag (EN/DE)
- Date created

### 5.4 Usage
Files can be selected as "CV Used" when adding an application.

---

## 6. Module: Applications Tracker

### 6.1 Purpose
Personal job application tracker — self-managed.

### 6.2 Add Application
Fields:
- Job Title (required)
- Company (required)
- Job URL
- Notes
- Salary (optional)
- CV Used (select from Files)
- Status (defaults to To Apply)
- Application Date

### 6.3 Views

#### Table View
Structured list with editable fields and status dropdown.

#### Kanban View
Columns: To Apply / Applied / Interview / Accepted / Rejected
- Drag & drop status changes
- Dropdown status update

### 6.4 CSV Import & Export
- Download blank template
- Import CSV with validation (all rows must be valid before commit)
- Export full application list as CSV

### 6.5 Application Source
All free plan applications: **Source = Self**
Free candidates are unlimited — no quota applies to their self-tracking.

---

## 7. Module: Profile

### 7.1 Account Information
- Update name, email, password

### 7.2 Plan Info
- Current Plan: Free
- Upgrade Plan button

### 7.3 Marketing Data
- Displays onboarding questionnaire responses

### 7.4 Activity Log
Tracks:
- CV uploads
- CV exports
- Application creation
- Status updates

---

## 8. Upgrade Triggers

Triggered naturally by:
- Reaching the CV export limit
- Clicking "Enhance with AI" (locked feature)
- Wanting employee-managed applications

On upgrade → all data carries over (CVs, applications, history). Nothing is lost.

---

## 9. Limitations (Free Plan)

- No AI CV enhancement
- No cover letter generation
- No employee-managed applications
- No FAQ interview preparation
- No job discovery
- Export limit enforced (set by Super Admin)
- Files = own exports only

---

## 10. Summary

The Free Plan is a fully functional job search toolkit that builds habit, demonstrates value, and creates natural upgrade pressure through export limits and locked AI features.
