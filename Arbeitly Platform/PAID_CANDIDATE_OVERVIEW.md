# Arbeitly — Paid Candidate Overview

---

## Who is a Paid Candidate?

A paid candidate is a job seeker who has purchased an Arbeitly plan and is actively being managed by a dedicated advisor from the agency. They have full access to the candidate portal and are receiving a hands-on, end-to-end placement service.

Unlike a free candidate who self-manages their job search, a paid candidate is a **client of the agency**. Their advisor works alongside them — building their CV, generating cover letters, preparing interview Q&As, discovering relevant job opportunities, and tracking every application. The candidate stays informed and involved through their own personal portal, which reflects everything their advisor is doing on their behalf.

The relationship is collaborative. The advisor does the heavy lifting; the candidate reviews, approves, and contributes where needed.

---

## How a Paid Candidate Joins

1. Selects a paid plan on the pricing or registration page
2. Completes payment
3. Fills in a detailed **onboarding questionnaire** covering their full career profile
4. Is assigned to an advisor by the Super Admin
5. The advisor reviews the onboarding profile and begins active placement work
6. The candidate gains access to their full portal as the advisor starts populating it

> Candidates who upgrade from a free plan follow the same path from step 3 onwards. All previously tracked applications carry over.

---

## Onboarding Profile

The onboarding questionnaire is the foundation of the entire service. It gives the advisor everything they need to represent the candidate effectively.

The profile captures:

| Category | Fields |
|---|---|
| **Personal** | First name, last name, date of birth, place of birth, address |
| **Contact** | Application email, phone number, LinkedIn profile |
| **Current Role** | Job title, employer, field / industry, years of experience, current salary, notice period |
| **Work History** | Whether they have worked in Germany before |
| **Education** | Highest level of study, degree title, university, university location |
| **Skills** | Top skills, certifications |
| **Career Goals** | Career goal statement, target roles, target industries, employment type preference, preferred location, open to relocation, preferred salary, target companies, open to career change |
| **Language & Other** | German language level, driving licence |
| **Background** | Transition motivation (if changing fields), training needs, how they heard about Arbeitly, additional information |

This profile is read-only for the candidate — it is filled in during onboarding and updated by the advisor as needed. The advisor uses it to build CVs, write cover letters, and match job opportunities.

---

## What a Paid Candidate Can Access

| Section | Available | Notes |
|---|---|---|
| **Board** | Yes | Pipeline overview of all tracked applications |
| **Applications** | Yes | Full application tracker with import/export |
| **Files** | Yes | Advisor-prepared CVs and cover letters |
| **FAQ** | Yes | Advisor-prepared interview Q&As to review and approve |
| **Onboarding** | Yes | Read-only view of their career profile |
| **Profile & Settings** | Yes | Personal details, password, activity log |
| **Job Discovery** | Advisor-side | Advisor runs matching; queued jobs appear in Applications |
| **AI CV Enhancement** | Advisor-side | Advisor runs AI; results visible in Files |

---

## Board

The Board is the paid candidate's home screen. It gives an immediate visual summary of their entire job search pipeline — all applications across every status stage.

The board shows counts for each stage:
- **To Apply** — queued opportunities
- **Applied** — submitted applications
- **Interview** — active processes
- **Accepted** — received offers
- **Rejected** — closed applications

It also surfaces key stats from the advisor's work: total applications tracked, interviews achieved, and offer count. This gives the candidate a clear sense of momentum and progress.

---

## Applications

The Applications section is a shared, collaborative tracker between the candidate and their advisor. Both parties can add entries, and each entry is clearly attributed to who added it.

### What the Candidate Can Do

- **Add** their own job applications manually
- **Edit and delete** entries they added themselves
- **Change status** on their own entries
- **Search** by job title or company name
- **Filter** by status
- **Import** applications via CSV (bulk upload)
- **Export** their full application list as CSV
- **Download** a blank CSV template

### What the Advisor Adds

The advisor can add applications on behalf of the candidate — opportunities they have identified or applied to directly. These entries appear in the candidate's list with a clear **"Added by [Advisor Name]"** badge.

- Advisor-added entries are **read-only** for the candidate — they cannot edit or delete them
- The status dropdown is disabled on advisor-added entries
- This prevents candidates from accidentally overwriting advisor-managed data

### Application Fields

| Field | Description |
|---|---|
| Position Name | Job title |
| Company | Company name |
| Application Date | Date applied or planned |
| Status | To Apply / Applied / Interview / Accepted / Rejected |
| Job URL | Link to the original posting |
| Salary | Expected or advertised salary |
| Contact Person | Recruiter or hiring manager |
| Next Action | Reminder of the next step |
| Job Description | Full or summarised JD for reference |

### CSV Import & Export

**Template** — Download a pre-formatted CSV with correct column headers to fill in.

**Import** — Upload a completed CSV. The platform validates every row before committing. Missing required fields (job title or company) are flagged per row. A preview table is shown before confirmation. All rows must be valid — no partial imports are allowed.

**Export** — Downloads all current applications as a CSV, named with the candidate's name.

---

## Files

The Files section is a read-only library of CVs and cover letters prepared by the advisor. The candidate can preview and download any document as a PDF.

### CV Library

The advisor builds and maintains a versioned CV tree:

```
Original Upload
├── Version A — Finance Sector (Modern)
│   ├── Goldman Sachs Variant
│   └── Deutsche Bank Variant
├── Version B — Tech Sector (Classic)
│   └── SAP Variant
└── Version C — AI Enhanced (Minimal)
```

- **Original** — The base CV built from the onboarding profile
- **Versions** — Named variations tailored to different industries, roles, or styles
- **Variants** — Further customisations within a version, tailored to a specific company or application

Each CV has a visual style (Modern, Classic, or Minimal) and a creation date.

### Cover Letter Library

Cover letters follow the same tree structure — an Original and named Versions. Each cover letter is generated by the advisor based on a specific job description and is tailored to the candidate's profile and tone preferences.

### Preview & Download

The candidate can:
- **Preview** any CV or cover letter in a full-screen viewer within the portal
- **Download as PDF** — opens a print dialog pre-formatted to produce a clean PDF
- Expand and collapse version trees to navigate the library

---

## FAQ — Interview Preparation

The FAQ section contains interview question-and-answer pairs prepared by the advisor. These represent how the candidate should present themselves in interviews — answers are written to reflect the candidate's real experience, tone, and goals.

The candidate plays an active role in reviewing and approving each item before it is considered ready.

### How It Works

1. The advisor adds a question and a suggested answer
2. The candidate sees it in their portal as **Pending Approval**
3. The candidate reviews the answer and takes one of three actions:

| Action | What Happens |
|---|---|
| **Approve** | Marks the item as approved. The answer is accepted as-is |
| **Submit My Answer** | The candidate writes their own preferred answer. It replaces the advisor's version, auto-approves, and is locked — the advisor cannot overwrite it |
| **Unverify** | Reverts an approved item back to pending (e.g. if the candidate wants to reconsider) |

### Locking

If a candidate submits their own answer, the item is **locked by candidate**. The advisor can see this and can delete and recreate the item if needed, but cannot edit a locked answer directly. This ensures the candidate's voice is preserved.

### Activity History

Each FAQ item has a collapsible activity log showing the full history — when it was created, who edited the answer, when it was approved, and whether the candidate overrode it.

### Stats Bar

At the top of the FAQ page, a summary shows:
- Total Q&A items
- How many are approved
- How many are still awaiting the candidate's approval

---

## Onboarding (Read-Only View)

The paid candidate can view their full onboarding profile within the portal. This is a read-only reference — they can see exactly what information the advisor is working from.

It covers all the fields completed during onboarding: personal details, career history, education, skills, career goals, and preferences.

> If any information changes (e.g. new job title, updated salary expectation), the candidate communicates this to their advisor, who updates the profile from the employee portal.

---

## Profile & Settings

The Settings page allows the candidate to manage their account and view their personal activity history.

### Account Details
- Update first and last name
- Update email address
- Change password (requires current password verification)

### Notification Preferences
- Toggle email, push, and SMS notifications on or off

### Activity Log

The Activity tab within Settings gives the candidate a personal audit trail — a chronological list of everything that has happened on their account, from both sides.

This includes:
- Applications added (by them or their advisor)
- Status changes
- CV versions created or enhanced
- Cover letters prepared
- FAQ items added, edited, approved, or overridden
- When they first signed up

Each entry shows who performed the action, what it was, and when it happened. This gives the candidate full transparency into the work being done on their behalf.

---

## The Candidate–Advisor Relationship

The paid candidate experience is built around a collaborative dynamic:

| The Advisor Does | The Candidate Does |
|---|---|
| Builds and refines CVs | Reviews and downloads their CV |
| Writes cover letters | Reviews and downloads cover letters |
| Prepares interview Q&As | Approves, personalises, or overrides answers |
| Discovers and queues job opportunities | Sees them appear in their Applications list |
| Tracks application progress | Follows along and adds their own entries |
| Manages the placement process end-to-end | Stays informed and participates where needed |

The candidate is never left in the dark. Every action their advisor takes is visible in their portal — either directly (in Files, FAQ, Applications) or via their personal Activity Log.

---

## Summary

A paid candidate receives a fully managed job search service, supported by their own transparent portal. They are not passive — they approve documents, confirm interview answers, track their own applications, and maintain visibility into everything happening on their behalf.

| Feature | Free | Paid |
|---|---|---|
| Application tracking | Yes | Yes |
| CSV import / export | Yes | Yes |
| Advisor-managed CVs (Files) | No | Yes |
| Cover letters (Files) | No | Yes |
| Interview FAQ preparation | No | Yes |
| Onboarding profile | No | Yes |
| Job discovery (via advisor) | No | Yes |
| AI CV enhancement (via advisor) | No | Yes |
| Dedicated advisor | No | Yes |
| Personal activity log | No | Yes |
