# Arbeitly — Employee (Advisor) Overview

---

## Who is an Employee?

An employee is a member of the recruitment agency team — typically a career advisor, recruiter, or placement consultant. They are the primary service delivery role on the platform. Each employee is assigned one or more paid candidates and is responsible for managing the full placement journey for each one.

Employees do not sign up themselves. Their accounts are created by the Super Admin, who also assigns candidates to them and sets their operational parameters (such as AI prompt limits per candidate).

The employee's portal is the most feature-rich view in Arbeitly. For each assigned candidate, an employee has access to a complete suite of tools — from CV building and job discovery to application tracking and interview preparation.

---

## How an Employee Accesses the Platform

1. Super Admin creates their account (name, email, password)
2. Employee logs in at `/employee/login` using their credentials
3. They land on their **Board** — a Kanban overview of all candidates they manage
4. From there they can navigate to any candidate's full detail view

---

## The Employee Portal — Navigation

The employee portal has two layers of navigation:

**Global (sidebar)** — applies across all candidates:
- Board — overview of all assigned candidates
- Applications — aggregated application view
- Documents — shared document library
- Upload CV — upload raw CV files
- Cover Letter — cover letter generator
- Analytics — performance metrics

**Internal (admin functions)**:
- Operations — internal overview
- Candidates — manage all assigned candidates
- Job Discovery — global job scan

**Per-Candidate (tab view)** — accessed by clicking into any candidate:
- Profile, Onboarding, Applications, CV, Cover Letter, Files, Account, Job Discovery, FAQ

---

## Candidate Management

### Candidate List (Board)

The Board is the employee's home screen. It presents all assigned candidates in a Kanban-style layout, giving the employee a quick snapshot of each candidate's status across the pipeline.

Each candidate card shows:
- Name and current plan
- Total applications tracked
- Number of interviews and acceptances
- AI prompt usage (used / limit)
- Quick link to open their full profile

### Candidate Detail View

Clicking any candidate opens their full detail view — a tabbed workspace with everything the employee needs to manage that person's placement. At the top, a persistent header shows:

- Candidate name, status badge, and plan
- Key stats: signed up date, total apps, interviews, acceptances
- AI prompt usage meter (e.g. 4/20)
- Tab navigation across all sections

---

## Profile Tab

A read-only summary of the candidate's personal and account details:

- Full name, account email, application email
- Phone number, LinkedIn profile
- Preferred location and salary expectation
- Plan name, plan type, account status, date created

This is a quick reference — no editing is done here. Account-level changes are handled in the Account tab.

---

## Onboarding Tab

Displays the candidate's full onboarding questionnaire responses — the detailed career profile collected at sign-up. This is the primary reference the employee uses when building CVs and cover letters.

Fields covered include current role, employer, field, years of experience, salary, notice period, education, top skills, certifications, career goals, target roles and industries, preferred location and salary, German language level, driving licence, and more.

This tab is read-only. If the candidate's circumstances change, the employee updates the profile here.

---

## Applications Tab

The Applications tab is a shared, collaborative tracker between the employee and the candidate. Both parties can add entries; each entry is attributed to its author.

### What the Employee Can Do

- **Add** job applications on behalf of the candidate
- **Edit** entries they added themselves (cannot edit candidate-added entries)
- **Delete** any entry
- **Change status** on any entry
- **Switch between List and Kanban views**
- **Search** by job title or company
- **Filter** by status (List view only)
- **Import** applications from CSV
- **Export** all applications to CSV
- **Download** a blank CSV template

### Attribution

Every application added by the employee is tagged with their name. In the candidate's portal, these appear with an **"Added by [Employee Name]"** badge. Candidates can see but cannot edit or delete advisor-added entries.

Applications added by the candidate appear without a badge — the employee can see them but cannot edit them (they can delete if needed for housekeeping).

### List View

A detailed scrollable list showing all applications with:
- Job title and status chip
- Company, date, salary, contact person
- CV used (if specified)
- "Added by" badge (for advisor-added entries)
- Next action note
- Status dropdown, edit, and delete controls

### Kanban View

A column-based board with one column per status stage. Each card shows the job title, company, date, salary, CV used, and next action. Status can be changed by the in-card dropdown. Cards can be added directly to any column via the column's + button.

### CSV Import

- Employee uploads a CSV file
- Platform validates all rows before committing — missing job title or company blocks the import
- A preview table is shown before confirmation
- No partial imports — all rows must be valid
- Imported entries are tagged as advisor-added and marked as unseen by the candidate (triggering the unread badge in the candidate's sidebar)

### CSV Export

Downloads all applications for this candidate as a CSV, named with the candidate's name.

---

## CV Tab

The CV tab is the employee's primary workspace for building and managing the candidate's CV library. It is a rich-text editor with a versioned document tree.

### CV Tree Structure

```
Original Upload
├── Version A — Finance Sector (Modern)
│   ├── Deutsche Bank Variant
│   └── Goldman Sachs Variant
├── Version B — Tech Sector (Classic)
│   └── SAP Variant
└── Version C — AI Enhanced (Minimal)
```

- **Original** — Auto-generated from the candidate's onboarding profile on first load. Serves as the base document.
- **Versions** — Named variations of the CV, each with a designated style, tailored for a different sector, role type, or tone.
- **Variants** — Company-specific or role-specific tweaks within a version (e.g. a version tailored for Goldman Sachs vs Deutsche Bank).

### Editor

The active document is displayed in a rich-text editor. The toolbar supports:
- Text formatting: Bold, Italic, Underline
- Lists: Bullet and Numbered
- Alignment: Left, Centre, Right
- Undo / Redo
- Copy content

The employee selects any node in the tree (Original, Version, or Variant) — it loads into the editor for review or editing. Changes are saved manually with the **Save** button.

### CV Styles

Each Version and Variant has a visual style that controls how the PDF renders:

| Style | Description |
|---|---|
| **Modern** | Teal accents, clean sans-serif, section headers with coloured underlines |
| **Classic** | Traditional serif typography, double-rule header, formal layout |
| **Minimal** | Light grey palette, uppercase section labels, maximum whitespace |

### Creating Versions and Variants

**New Version** — Takes the current editor content as the base, prompts for a name and style, and saves it as a new lettered version (A, B, C…).

**New Variant** — Creates a company-specific variation within an existing version, prompts for a name and style, and saves it under the parent version.

### PDF Export

Any node (Original, Version, or Variant) can be previewed and exported as a PDF:
- **Preview** — Opens a full-screen modal with an iframe rendering of the styled HTML
- **Export PDF** — Opens a new tab and triggers the browser print dialog, formatted for clean PDF output

### AI Enhancement

The **Enhance with AI** button opens a modal that allows the employee to:

1. Choose where to save the result — as a new Version or as a Variant under an existing Version
2. Name the enhanced document
3. Choose a visual style
4. Optionally write a custom prompt (e.g. "Focus on leadership and team management", "Tailor for the fintech sector")
5. Confirm — a 2-second simulation runs and the enhanced version is saved to the tree

**Prompt limit** — Each candidate has an AI prompt allowance set by the Super Admin. The usage meter (e.g. 4/20 — 16 left) is shown in the candidate header and within the enhancement modal. Once the limit is reached, further enhancements are blocked until the Super Admin bumps the limit. Usage syncs back to the employee's assignment record.

---

## Cover Letter Tab

The Cover Letter tab allows the employee to generate personalised cover letters for each candidate based on a specific job description.

### Input Methods

The employee can provide the job description in two ways:

- **Paste** — Directly paste the JD text into a text area
- **Extract from URL** — Enter the job posting URL; the platform extracts the description automatically (simulated in current frontend)

### Generation Settings

Before generating, the employee sets:

| Setting | Options |
|---|---|
| Tone | Professional, Friendly, Confident, Formal |
| Language | English, German |

### Generation

Clicking **Generate Cover Letter** produces a personalised letter using the candidate's onboarding profile (name, current role, employer, field, years of experience, German level, etc.) and the job description. The result appears in a text area for review and editing.

### Cover Letter Library

Generated letters can be saved to a versioned library (same tree structure as CVs):

- **Save as Original** — Auto-saved when the first letter is generated, if no original exists yet
- **Save to Library** — Prompts for a name and style, saves as a named Version accessible to the candidate in their Files tab

Saved versions can be previewed in a full-screen PDF viewer or downloaded.

---

## Files Tab

The Files tab is the employee's upload area for supporting documents — certificates, reference letters, language test results, or any other file relevant to the candidate's application process.

Uploaded files are visible to the candidate in their own Files section.

Each file entry shows:
- File name and type
- File size
- Upload date
- Who uploaded it (employee or candidate)

Files can be deleted by the employee at any time.

---

## Job Discovery Tab

Job Discovery is an AI-powered job matching tool. The employee runs it to surface relevant job opportunities based on the candidate's onboarding profile — target roles, preferred location, industry, salary range, years of experience, and language level.

### How It Works

1. Employee clicks **Refresh Jobs**
2. The platform generates a list of matched jobs (up to 12) drawn from sources including LinkedIn, Indeed, StepStone, and Xing
3. Each job is scored with a **match percentage** and a list of match reasons (e.g. "Role matches target position", "Salary within target range", "German level meets requirement")
4. Jobs are sorted by match score — highest first

### Job Cards

Each job card shows:
- Job title, company, location
- Salary range, job type (Full-time / Remote)
- Source platform tag (LinkedIn, Indeed, etc.)
- Match score and match reasons
- Expand to read the full job description
- **Add to Queue** button — adds the job directly to the candidate's Applications list as a "To Apply" entry

### Filtering

The employee can filter discovered jobs by match quality:
- **All** — show everything
- **High Match** — 80%+ score only
- **Medium Match** — 60–79% score only

### Duplicate Detection

When jobs are refreshed, the platform automatically detects duplicates — jobs with the same company and job title appearing from multiple sources. Duplicates are flagged with a **"Possible duplicate"** badge so the employee does not queue the same opportunity twice.

When any job from a duplicate group is actioned (added to queue), the duplicate flags for the entire group are cleared.

---

## Account Tab

The Account tab displays the candidate's subscription and account details, with options for the employee to make administrative updates:

- **Plan** — Current plan name and price
- **Plan Type** — Free or Paid
- **Status** — Active or Pending
- **Account Created** — Sign-up date
- **Preferred Location** — From onboarding
- **Preferred Salary** — From onboarding

The employee can edit the candidate's full name, email, plan, and status directly from this tab.

---

## FAQ Tab

The FAQ tab is where the employee builds and manages interview preparation Q&A pairs for the candidate.

### Adding a Q&A

The employee clicks **Add Q&A** and fills in:
- The interview question
- The suggested answer

New items are created with a **Pending Approval** status — they require the candidate to review and approve them before they are considered finalised.

### Managing Items

- **Edit** — Update the question or answer on any item the candidate has not locked. Editing resets the status to Pending.
- **Approve** — The employee can also approve items (e.g. after discussing with the candidate offline)
- **Unverify** — Reverts an approved item back to Pending
- **Delete** — Remove any item, including those locked by the candidate (the only way to remove a candidate-locked answer)

### Candidate Locking

If the candidate has submitted their own answer via their portal, the item is marked **"Candidate Answer"** and is locked. The employee cannot edit a locked item — they must delete and recreate it if a change is needed.

### Activity History

Each FAQ item has a collapsible activity log showing the full history of changes — who created it, when it was edited, when it was approved, and whether the candidate overrode the answer.

### Stats

A stats bar at the top of the tab shows total items, how many are approved, and how many are pending candidate approval — giving the employee a quick sense of how much interview prep work remains.

---

## AI Prompt Limit

Each candidate assigned to an employee has an individual AI prompt allowance, set by the Super Admin. This controls how many AI CV enhancements can be run for that candidate.

- The limit is displayed in the candidate header as a progress meter (e.g. **5/20 — 15 left**)
- Each use of **Enhance with AI** consumes one prompt
- When the limit is reached, the enhance button is disabled
- The employee can contact the Super Admin to request a limit increase

Usage is tracked per assignment (candidate + employee pair) and syncs in real time.

---

## What the Employee Cannot Do

- **Register candidates** — candidates sign up themselves through the public flow
- **Access other employees' candidates** — each employee only sees their own assigned candidates
- **Set or change prompt limits** — this is Super Admin only
- **Edit candidate-submitted FAQ answers** — locked items are read-only; delete and recreate is the only option
- **Edit candidate-added applications** — entries the candidate added themselves are protected; the employee can delete but not modify them

---

## Summary

The employee is the operational core of Arbeitly. They are responsible for delivering a complete, high-quality placement service for every candidate assigned to them — using a structured set of tools that covers every stage of the job search lifecycle.

| Tool | Purpose |
|---|---|
| Board | Overview of all assigned candidates |
| Applications | Collaborative tracker — add, manage, import/export |
| CV Builder | Versioned CV library with rich-text editor and AI enhancement |
| Cover Letter Generator | Tailored letters per job, saved to candidate's library |
| Job Discovery | AI-powered job matching with queue-to-apply workflow |
| Files | Supporting document uploads |
| FAQ | Interview preparation Q&As with candidate approval workflow |
| Account | Candidate plan and status management |
| Onboarding | Reference profile used for all content creation |
