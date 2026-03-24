# Arbeitly — Business Overview & Logic

---

## What is Arbeitly?

Arbeitly is a **job placement management platform** built for recruitment and career advisory agencies. It provides a structured, end-to-end workspace where advisors manage job seekers throughout their entire job search journey — from onboarding and CV preparation, to applications tracking, interview coaching, and placement.

The platform operates as a **multi-tenant SaaS product**, meaning a single agency (with multiple advisors) can manage hundreds of candidates simultaneously from one central dashboard.

Arbeitly is not a job board. It does not directly connect candidates with employers. Instead, it empowers agencies and their advisors to deliver a premium, organised service to each candidate they represent — with full visibility, documentation, and workflow tooling built in.

---

## Why is Arbeitly Used?

Traditional recruitment workflows are fragmented — advisors juggle spreadsheets, email threads, shared drives, and manual status updates. This creates:

- Lost applications and missed follow-ups
- No single view of a candidate's progress
- Inconsistent CV and cover letter quality
- No audit trail of what was done for each candidate
- Candidates left in the dark about their own job search

Arbeitly solves this by centralising every part of the placement process into one platform:

- Advisors have a structured workspace per candidate
- Candidates have their own portal to stay informed and involved
- Super Admins have full platform oversight, team management, and billing control
- All activity is logged and traceable

---

## Who Are the Users?

Arbeitly has three distinct user types, each with their own portal and set of responsibilities.

---

### 1. Candidate (Job Seeker)

A candidate is the person being placed into a job. They sign up via the public-facing registration flow, complete an onboarding questionnaire, and are then assigned to an advisor.

Candidates come in two tiers:

- **Free plan** — Limited access. Can track their own applications and manage their profile only.
- **Paid plan** — Full access to the candidate portal, including advisor-prepared files, FAQ review, and onboarding documentation.

#### High-Level Functions

| Function | Description |
|---|---|
| **Registration & Onboarding** | Signs up, selects a plan, completes a detailed onboarding questionnaire covering career history, goals, skills, and preferences |
| **Application Tracking** | Tracks all job applications in one place with status updates (To Apply → Applied → Interview → Accepted / Rejected). Can add, edit, and delete their own entries |
| **Advisor-Added Applications** | Applications added by their advisor appear in the same list, clearly marked with "Added by [Advisor]" attribution |
| **CSV Import / Export** | Can import applications in bulk via CSV template, or export their full application list |
| **CV & Cover Letter Files** | Views CVs and cover letters prepared by their advisor. Can preview and download as PDF |
| **FAQ Review & Approval** | Advisor prepares common interview Q&As on their behalf. Candidate reviews each one, approves the answer, or submits their own preferred answer |
| **Activity Log** | Views a personal history of all actions taken on their account — by themselves and their advisor |
| **Profile & Settings** | Updates personal details, email, and password |

---

### 2. Employee (Advisor / Recruiter)

An employee is a member of the agency team. Each employee is assigned one or more candidates and is responsible for managing their full placement journey. Employees log in through a separate portal with access to a rich set of tools per candidate.

#### High-Level Functions

| Function | Description |
|---|---|
| **Candidate Management** | Views and manages all assigned candidates from a central dashboard. Sees high-level stats per candidate (total apps, interviews, accepted, plan usage) |
| **Application Tracking** | Adds, edits, and manages job applications on behalf of each candidate. Applications they add are marked as advisor-sourced in the candidate's view |
| **CSV Import / Export** | Imports and exports application data per candidate via CSV |
| **CV Builder** | Creates and manages a versioned CV library per candidate. Supports an Original, named Versions (e.g. "Finance Sector"), and Variants (e.g. "Goldman Sachs Variant") within each version. Three visual styles: Modern, Classic, Minimal |
| **AI CV Enhancement** | Uses AI prompts to enhance the active CV. Each enhancement is saved as a new version or variant. Usage is tracked against a per-candidate prompt limit set by the Super Admin |
| **Cover Letter Builder** | Generates tailored cover letters per job description (by pasting text or extracting from a URL). Letters are saved to a versioned library per candidate |
| **Job Discovery** | Runs a job matching scan based on candidate's profile. Discovered jobs are scored by match quality, tagged with source platform (LinkedIn, Indeed, StepStone, Xing), and checked for duplicates. Advisor can queue a job directly into the candidate's applications |
| **FAQ Management** | Creates interview Q&A pairs for the candidate. Can edit and delete items (unless the candidate has locked an answer with their own override). Can approve or unverify answers |
| **File Management** | Uploads supporting files to the candidate's profile (e.g. reference letters, certificates) |
| **Onboarding View** | Read-only view of the candidate's onboarding profile — used to inform CV and cover letter content |

---

### 3. Super Admin

The Super Admin is the platform operator — typically the agency owner or operations manager. They have full visibility across all candidates, all employees, and all platform configuration. Super Admins do not manage individual candidates directly but oversee and configure the entire platform.

#### High-Level Functions

| Function | Description |
|---|---|
| **Candidate Overview** | Views all registered candidates across the platform, their plan, status, onboarding data, and application count. Can edit candidate details and plan assignment |
| **Candidate Detail** | Drills into any candidate's profile to see their full application history, onboarding, and current assignment |
| **Employee Assignment** | Assigns candidates to employees. Reassigns from one employee to another |
| **Prompt Limit Management** | Sets and adjusts the AI prompt limit per candidate-employee assignment. Can bump limits by +5 or +10, or set a custom cap |
| **View as Employee** | Opens any candidate's full profile in employee view — for QA, coaching, or support purposes |
| **Employee Management** | Creates, edits, deactivates, and deletes employee accounts. Assigns candidates to employees directly from the employee panel. Views per-candidate AI usage stats per employee |
| **Pricing Plan Management** | Creates and manages subscription plans (name, price, features, free/paid tier). Plans are referenced throughout the platform for feature gating |
| **AI Configuration** | Manages global CV and cover letter prompt templates used by the AI enhancement engine |
| **Audit Log** | Views a full activity log across all users. Selects any candidate or employee to see their complete history — every application change, CV action, FAQ interaction, and more |

---

## How the Users Connect

```
Super Admin
    │
    ├── Creates & manages Employees
    ├── Assigns Candidates to Employees
    ├── Sets AI prompt limits per assignment
    └── Monitors everything via Audit Log

Employee (Advisor)
    │
    ├── Manages assigned Candidates
    ├── Builds CVs, Cover Letters, FAQs
    ├── Adds applications to candidate's tracker
    ├── Runs Job Discovery scans
    └── Communicates progress via the platform

Candidate (Job Seeker)
    │
    ├── Views and tracks their job applications
    ├── Reviews advisor-prepared CVs and cover letters
    ├── Approves or overrides FAQ answers
    └── Stays informed via their personal portal
```

---

## Core Business Logic Rules

- **One advisor per candidate** — A candidate is assigned to exactly one employee at a time. Reassignment is managed by the Super Admin.
- **Prompt limits are per-assignment** — The AI enhancement allowance is set per candidate-employee pair, not globally. This gives the Super Admin granular cost control.
- **Application attribution** — Every application is tagged with who added it (candidate or advisor). Candidates cannot edit advisor-added entries; advisors cannot edit candidate-added entries.
- **FAQ locking** — Once a candidate submits their own answer to an FAQ item, it is locked. The advisor cannot overwrite it — they can only delete the item and recreate it if needed.
- **Paid vs Free access** — Free candidates only see Board and Applications. Paid candidates additionally see Files (advisor CV/CL library), FAQ, and Onboarding sections.
- **Audit trail** — All significant actions across all user types are recorded with timestamp, actor, and target. This log is visible to the Super Admin and to each user within their own activity view.
