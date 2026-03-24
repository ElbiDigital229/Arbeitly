# Arbeitly — Super Admin Overview

---

## Who is a Super Admin?

The Super Admin is the operator of the Arbeitly platform — typically the agency owner or operations manager. They have full visibility and control across every part of the system: all candidates, all employees, all subscription plans, and all activity.

The Super Admin does not manage individual candidates day-to-day. That is the employee's role. Instead, the Super Admin oversees the entire operation — creating and managing the team, assigning candidates to advisors, setting AI usage limits, configuring subscription plans, and monitoring platform activity through the audit log.

There is one Super Admin login per platform instance. They access the platform through a dedicated login screen at `/superadmin/login`.

---

## Super Admin Portal — Navigation

The Super Admin sidebar contains five sections:

| Section | Purpose |
|---|---|
| **Overview** | Platform-level stats and a snapshot of recent sign-ups and active plans |
| **Candidates** | Full list of all registered candidates with inline profile views and edit controls |
| **Employees** | Team management — create, edit, assign, and monitor all advisors |
| **Pricing Plans** | Create and manage the subscription plans shown on the public pricing page |
| **Audit Log** | Full activity history across all users — select any user to view their log |

---

## Overview

The Overview page is the Super Admin's home screen. It surfaces a high-level summary of platform health at a glance.

### Stats Cards

| Stat | Description |
|---|---|
| **Total Candidates** | Count of all registered candidates across both free and paid plans |
| **Active Plans** | Number of pricing plans currently configured |
| **New This Month** | Candidates who signed up during the current calendar month |
| **System Health** | Platform uptime indicator |

### Recent Candidates

A list of the five most recently registered candidates, showing name, email, plan name, and sign-up date. Gives the Super Admin an immediate view of new activity without needing to open the full Candidates page.

### Active Plans

A summary of all configured pricing plans with their names and prices. Plans marked as "Most Popular" are highlighted. This is a read-only snapshot — plan management is done from the Pricing Plans page.

---

## Candidates

The Candidates page lists every candidate registered on the platform, regardless of plan or status. It is the Super Admin's primary reference for understanding who is on the platform and managing their details.

### Search

A live search bar filters the list by candidate name, email, or plan name.

### Candidate List

Each candidate appears as a row showing:
- Full name and email
- Plan name and price
- Sign-up date
- Status badge (Active / Pending)
- Current role or field (where available from onboarding)

### Actions per Candidate

Three controls are available on each row:

| Action | What It Does |
|---|---|
| **View** | Opens the full Candidate Detail page for that candidate |
| **Edit** | Opens an edit dialog to update name, email, plan, and status |
| **Profile** | Expands an inline panel below the row showing the candidate's onboarding data |

### Inline Profile Panel

Clicking **Profile** expands a collapsible panel directly within the list:

- **Free candidates** — Shows the three marketing questionnaire fields: industry, target country, and how they heard about Arbeitly
- **Paid candidates** — Shows the full onboarding profile in a multi-column grid covering all fields from personal details through to career goals, skills, and preferences

### Edit Dialog

The Super Admin can update four fields for any candidate:
- Full name
- Email address
- Plan — select from any configured pricing plan
- Status — Active or Pending

---

## Candidate Detail

Clicking **View** on any candidate opens their full detail page. This is the Super Admin's main workspace for managing a specific candidate's assignment and AI prompt usage.

### Header

The candidate's name, status badge, plan badge, and email are shown at the top. A back button returns to the Candidates list.

### Stats Row

Four cards showing:
- **Signed Up** — Account creation date
- **Total Apps** — Total applications tracked in their tracker
- **Interviews** — Applications at Interview status
- **Accepted** — Applications at Accepted status

### Assign to Employee

A dropdown lets the Super Admin assign the candidate to any active employee. Selecting a new employee immediately reassigns — it removes the candidate from any previous assignment and adds them to the selected employee's list.

If no active employees exist, a note prompts the Super Admin to create employees first.

### AI Prompt Usage

This card is shown only when the candidate is assigned to an employee. It displays:

- A progress bar showing how many AI enhancement prompts have been used against the current limit (e.g. **4 / 20 — 16 left**)
- **+5** and **+10** quick-bump buttons to increase the limit immediately
- **Set limit** — opens a dialog to enter any custom limit number

Once the limit is set, the employee cannot run further AI enhancements until the Super Admin increases it.

A **View as Employee** link opens the candidate's full profile in the employee portal view in a new tab — useful for QA, coaching, or support.

### Onboarding Profile / Marketing Questions

Below the assignment controls, the candidate's profile is displayed:
- **Free candidates** — Marketing questionnaire fields (industry, target country, how they heard)
- **Paid candidates** — Full onboarding profile in a multi-column grid

### Applications Tracked

A read-only list of all applications in the candidate's tracker. Each entry shows job title, company, status chip, date, salary, contact person, and a link to the job posting if available. Applications added by the advisor are flagged with a "Platform" tag.

---

## Employees

The Employees page is where the Super Admin manages the agency's team of advisors.

### Employee List

Each employee row shows:
- Full name and email
- Account creation date
- Status badge (Active / Inactive)
- Candidate count — how many candidates are currently assigned to them

### Actions per Employee

| Action | What It Does |
|---|---|
| **Edit** | Opens a dialog to update name, email, password, and status |
| **Delete** | Permanently removes the employee account |
| **Assign** | Expands the assignment panel |

### Add Employee

The **Add Employee** button opens a creation dialog with four fields:
- Full name
- Email address
- Password (set by the Super Admin — employees do not self-register)
- Status (Active / Inactive)

Once created, the employee can log in at `/employee/login` using these credentials.

### Assignment Panel

Expanding an employee's row via the **Assign** button opens a collapsible panel with two sections:

**Assign Candidates** — A checkbox grid of all registered candidates. Each candidate card shows their name, email, and plan name. Checking a candidate assigns them to this employee; unchecking removes them. Assignments take effect immediately.

**Prompt Usage** — For each currently assigned candidate, a mini progress bar shows their AI enhancement usage (prompts used / limit). This gives the Super Admin a quick overview of consumption across the employee's full caseload without needing to open each candidate individually.

---

## Pricing Plans

The Pricing Plans page controls every subscription plan that appears on the public-facing pricing page and the registration flow.

### Plan Cards

Each plan is displayed as a card showing:
- Plan name, price, and price suffix (e.g. "+ 8.5% SUCCESS FEE")
- Billing description (e.g. "one time payment")
- A feature list — each item marked as included (green tick) or excluded (grey cross)
- "Most Popular" badge if flagged

### Creating a Plan

Clicking **Add Plan** opens a form with:

| Field | Description |
|---|---|
| Plan Name | e.g. Premium |
| Price | Display price, e.g. €499 |
| Price Suffix | Optional additional pricing note, e.g. "+ 8.5% SUCCESS FEE" |
| Billing Text | Billing cycle description, e.g. "one time payment" |
| Display Price | Short label used in confirmation screens |
| Total Label | Amount shown at checkout |
| Most Popular | Toggle to highlight this plan on the public pricing page |
| Features | A list of feature lines, each with an included/excluded toggle |

Features can be added or removed freely. Each feature has a toggle (included = shown with a green tick on the pricing page; excluded = shown with a grey cross).

### Editing and Deleting

Any existing plan can be edited via its **Edit** button, which opens the same form pre-filled. Plans can be deleted — deletion prompts for confirmation before removing the plan permanently.

---

## Audit Log

The Audit Log gives the Super Admin full visibility into every significant action taken on the platform by any user.

### Layout

The page uses a two-panel layout:

**Left panel — User list**
- Shows all registered candidates and employees
- Sorted by activity count (most active at the top)
- Each user entry shows their name, type (candidate or employee), and an activity count badge
- A search bar filters by name or email
- Candidate icons are blue; employee icons are teal (primary colour)

**Right panel — Activity feed**
- Clicking any user on the left loads their full activity history in the right panel
- The panel header shows the user's name, type, and total activity count
- Activities are listed in reverse chronological order (newest first)
- Each entry shows: actor name, action label, optional detail note, and timestamp

### Entry Details

Each audit log entry records:
- **Who** performed the action (actor name and user type)
- **What** happened — human-readable action label (e.g. "Application added", "CV enhanced by AI", "FAQ item approved")
- **Detail** — optional extra context (e.g. job title and company for an application, version name for a CV)
- **When** — timestamp formatted as day, month, year, hour, and minute

### User Activity Display

When a user is selected, entries are shown where they were either the **actor** (they performed the action) or the **subject** (something was done to their account). This means a candidate's feed will include both their own actions and advisor actions taken on their behalf.

### Action Types Tracked

| Category | Actions |
|---|---|
| **Candidate** | Signed up, assigned to employee, reassigned, profile viewed |
| **Applications** | Application added, status changed, application deleted, CSV imported, CSV exported |
| **CV** | Version created, variant created, AI enhancement run |
| **Cover Letter** | Version saved, variant saved, enhanced |
| **FAQ** | Item added, edited, deleted, approved, unverified, candidate override |
| **Job Discovery** | Job added to queue |
| **Employee** | Account created |
| **Prompt Limits** | Limit bumped |

---

## What the Super Admin Cannot Do

- **Take over an application workflow** — The Super Admin monitors and assigns but does not build CVs, write cover letters, or add applications on behalf of candidates. That is the employee's role.
- **Log in as another user** — The "View as Employee" link on the Candidate Detail page opens the employee view in a new tab, but this is a read-oriented navigation shortcut, not a true impersonation session.
- **Register candidates** — Candidates self-register via the public sign-up flow. The Super Admin can edit existing candidate records but cannot create new candidate accounts.
- **Reset their own password from within the platform** — There is no self-service password reset flow for the Super Admin account in the current build.

---

## Summary

The Super Admin is the control layer of Arbeitly. They configure the platform, build and manage the team, connect candidates to advisors, control AI usage costs, and maintain full audit visibility across all platform activity.

| Tool | Purpose |
|---|---|
| Overview | Platform health snapshot |
| Candidates | Full candidate registry with inline profile access and edit controls |
| Candidate Detail | Assignment management, prompt limit control, view-as-employee access |
| Employees | Team creation, candidate assignment, prompt usage monitoring |
| Pricing Plans | Subscription plan configuration for the public-facing site |
| Audit Log | Full per-user activity history across all candidates and employees |
