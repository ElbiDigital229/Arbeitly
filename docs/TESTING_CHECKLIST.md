# Arbeitly — Testing Checklist

Each item is a user-story-style scenario. Tick each one when verified end-to-end.

---

## 1. Free Candidate — Sign Up & Basic Portal

- [ ] Visit `/` → click "Get Started" (free) → lands on `/register?plan=free`
- [ ] Fill name, email, password, confirm password → submit → redirected to `/onboarding/simple`
- [ ] Simple onboarding form appears with: current field, preferred location, how they heard about Arbeitly
- [ ] Submit simple onboarding → redirected to `/candidate/applications`
- [ ] Sidebar shows: Applications, CV Builder, Files, Analytics, Profile — does NOT show Onboarding, FAQ, Billing
- [ ] Attempting to navigate directly to `/candidate/faq` → redirected or upgrade prompt shown (not accessible)
- [ ] Attempting to navigate directly to `/candidate/billing` → same as above

---

## 2. Free Candidate — Applications

- [ ] Click "Add Application" → dialog opens with fields: job title, company, URL, status, date, salary, notes
- [ ] Submit → new card/row appears in the list
- [ ] Status dropdown works: To Apply → Applied → Interview → Accepted / Rejected
- [ ] Edit application → changes saved
- [ ] Delete application → removed from list
- [ ] Search by job title or company → filters results in real time
- [ ] Filter by status (e.g. show only "Interview") → works
- [ ] Toggle between list view and Kanban board → both render correctly with cards in correct columns
- [ ] Application quota progress bar visible on Profile page showing `X used / Y total`
- [ ] When quota is hit → "Add Application" button is disabled + prompt to upgrade shown

---

## 3. Free Candidate — CV Builder

- [ ] Navigate to `/candidate/cv`
- [ ] "Upload PDF" button → upload a PDF → extracted data populates editor fields (name, email, experience, education, skills)
- [ ] "Create from Scratch" button → opens structured editor with empty sections
- [ ] Editor sections: Personal Info, Work Experience (add/remove entries), Education (add/remove), Skills, Summary
- [ ] Live preview renders HTML from editor content in real time
- [ ] Template selector: Modern / Classic / Minimal — switching changes preview style
- [ ] Language selector: EN / DE — visible
- [ ] "Save Version" → names the version, appears in the versions list
- [ ] "Export PDF" → export modal appears with template picker → confirm → PDF downloads + version counter increments
- [ ] Export counter shows `X / Y exports used`
- [ ] When export limit reached → "Upgrade to export more" prompt shown; export button disabled

---

## 4. Free Candidate — Files

- [ ] Navigate to `/candidate/files`
- [ ] Tree view shows original CV upload + all saved named versions
- [ ] Each entry has a source badge: Uploaded / AI Generated / Human Reviewed
- [ ] Search input filters visible files by name
- [ ] Filter chips (All / Uploaded / AI Generated / Human Reviewed / EN / DE) narrow the list correctly
- [ ] Preview button opens file content
- [ ] Download button downloads file

---

## 5. Free Candidate — Profile & Settings

- [ ] Navigate to `/candidate/profile`
- [ ] Shows: plan (Free), quota usage, account email, name
- [ ] Shows "Signup Info" card with: field, preferred location, how they heard (from simple onboarding)
- [ ] Does NOT show a full Onboarding card (paid only)
- [ ] Edit name and email → changes saved
- [ ] "Settings" link in sidebar → leads to password change form
- [ ] Change password: requires current password, new password, confirm → success toast on valid input
- [ ] Activity log section shows own actions with timestamps

---

## 6. Free Candidate — Upgrade Flow

- [ ] Profile page or pricing page → "Upgrade" → `/pricing` shown
- [ ] Select paid plan → `/payment` with plan pre-selected
- [ ] Complete payment flow → redirected to `/onboarding` (full paid onboarding form)
- [ ] Complete onboarding → redirected to `/candidate/applications`
- [ ] Sidebar now shows: Onboarding, FAQ, Billing tabs
- [ ] Profile now shows full onboarding card instead of Signup Info card

---

## 7. Free Candidate — Password Reset

- [ ] Click "Forgot Password" on `/candidate/login`
- [ ] Enter email → confirmation message shown
- [ ] `/candidate/reset-password` → enter new password + confirm → success
- [ ] Login with new password → works

---

## 8. Paid Candidate — Sign Up & Full Onboarding

- [ ] Visit `/pricing` → select paid plan → `/register` with plan pre-filled
- [ ] Fill registration form → `/payment`
- [ ] Complete payment → `/onboarding` (full form)
- [ ] Full onboarding sections: Work, Education, Skills, Career Goals, Germany Info
- [ ] Submit → redirected to `/candidate/applications`
- [ ] Sidebar shows all tabs including Onboarding, FAQ, Billing

---

## 9. Paid Candidate — Employee-Added Applications

- [ ] After super admin assigns an employee, employee adds an application in the candidate's tracker
- [ ] Candidate refreshes Applications page → new application appears with an "unseen badge" (new indicator)
- [ ] Badge disappears after candidate opens the Applications tab
- [ ] Application shows employee's name as "Added by [Name]"
- [ ] Candidate can add notes and edit status on employee-added applications

---

## 10. Paid Candidate — Quota Tracking

- [ ] Employee moves an application to "Applied" → `applicationsUsed` increments by 1
- [ ] Candidate's Profile page shows updated quota bar
- [ ] Super admin's Candidate Detail page shows updated quota
- [ ] When quota hits limit → employee cannot move more apps to "Applied"
- [ ] Super admin uses "Set Custom Limit" → quota increases → employee can continue

---

## 11. Paid Candidate — FAQ Tab

- [ ] Employee creates FAQ Q&A items (question + answer)
- [ ] Candidate opens `/candidate/faq` → items appear with "Pending Review" status
- [ ] Candidate clicks "Approve" → status changes to "Approved"
- [ ] Candidate edits an answer → status changes to "Candidate Override", item is locked
- [ ] Employee tries to edit a locked item → blocked (edit button disabled or shows error)
- [ ] Each FAQ item shows activity log: created, updated, approved, overridden — with timestamps and authors

---

## 12. Paid Candidate — Billing Tab

- [ ] Navigate to `/candidate/billing`
- [ ] Transaction history shows: date, plan name, amount, method, status badge (paid / pending / refunded)
- [ ] "Download Invoice" button per row → opens printable invoice in new window
- [ ] Invoice shows: Arbeitly branding, invoice number, candidate name, plan, amount, transaction ID

---

## 13. Employee — Login & Portal Access

- [ ] Navigate to `/employee/login`
- [ ] Enter valid credentials → redirected to `/employee/internal` (Overview)
- [ ] Enter invalid credentials → error message shown
- [ ] "Continue as Guest" → logs in as first active employee, redirects to Overview
- [ ] Sidebar shows: Overview, Candidates — nothing else (plus Settings + Log Out in footer)

---

## 14. Employee — Overview Page

- [ ] Stats cards visible: Total Assigned Candidates, Active Applications, Documents Generated, Success Rate
- [ ] Recent activity feed shows latest actions (CV optimisations, applications submitted, cover letters, interviews, new candidates)

---

## 15. Employee — My Candidates

- [ ] Navigate to `/employee/internal/candidates`
- [ ] Table shows all candidates assigned to the logged-in employee
- [ ] Columns: Name, Email, Field, Location, Total Apps, Interview Count, Accepted Count
- [ ] Search by name, email, or field → filters in real time
- [ ] Toggle list / grid view → both work
- [ ] Click a candidate row → navigates to `/employee/portal/candidates/:id`
- [ ] Attempting to access a candidate not assigned to this employee via direct URL → "You don't have access" message

---

## 16. Employee — Candidate Detail: Profile Tab

- [ ] Shows read-only: name, email, phone, LinkedIn, address
- [ ] Shows plan, status, account creation date
- [ ] Shows quick stats: total apps, interviews, accepted, quota usage

---

## 17. Employee — Candidate Detail: Onboarding Tab

- [ ] Shows full read-only onboarding answers across all sections
- [ ] Sections: Work, Education, Skills, Career Goals, Germany Info

---

## 18. Employee — Candidate Detail: Applications Tab

- [ ] Shows all platform-sourced applications for this candidate
- [ ] Employee can add a new application: job title, company, URL, status, date, salary, contact, next action, job description, CV used
- [ ] New application appears with `source: "platform"` and employee's name
- [ ] Application appears in candidate's portal with unseen badge
- [ ] Employee can edit their own applications
- [ ] Employee can delete their own applications
- [ ] Changing status to "Applied" → `applicationsUsed` increments
- [ ] Cannot edit applications marked as candidate-added
- [ ] Toggle list / Kanban view → both work
- [ ] Import CSV → column validation runs → preview shown → confirm imports rows
- [ ] Export CSV → file downloads with all applications for this candidate

---

## 19. Employee — Candidate Detail: CV Tab

- [ ] Shows candidate's existing CV versions and variants
- [ ] Upload a new CV on candidate's behalf → appears in list
- [ ] Generate AI-enhanced CV → new version created using onboarding data

---

## 20. Employee — Candidate Detail: Cover Letter Tab

- [ ] Shows existing cover letters for this candidate
- [ ] Generate a new cover letter → uses candidate's profile data → saved to list

---

## 21. Employee — Candidate Detail: Files Tab

- [ ] Shows all uploaded and AI-generated files for this candidate
- [ ] Files auto-added via Job Discovery → appear here
- [ ] Upload additional file → appears in list
- [ ] Delete file → removed

---

## 22. Employee — Candidate Detail: Account Tab

- [ ] Read-only view of candidate's job application credentials (email + password)
- [ ] Marked as "Authorised by candidate"

---

## 23. Employee — Candidate Detail: Job Discovery Tab

- [ ] Jobs generated based on candidate's onboarding data (roles, location, salary, experience, German level, field)
- [ ] Each job card shows: match score (colour-coded: green 80%+, yellow 60–79%, orange <60%), job type, company, location, salary, match reasons, source
- [ ] Filter by match score: All / 80%+ / 50–79% → filters visible cards
- [ ] "Details" button → expands job with 3 tabs: Job Description | Tailored CV | Cover Letter
- [ ] Tailored CV tab shows a formatted CV relevant to that specific job using candidate's real data
- [ ] Cover Letter tab shows a personalised letter for that job and company
- [ ] "Copy" button → copies text to clipboard (toast confirmation)
- [ ] "Save to Files" button → saves document to candidate's Files tab (no duplicate by filename)
- [ ] "Skip" button → pick reason (Irrelevant role, Low quality, Duplicate, Visa mismatch, Salary below target, Other) → job greyed out
- [ ] "Show skipped (N)" toggle → reveals skipped jobs with "Restore" button
- [ ] Restore → job returns to active list
- [ ] "Refresh" → fetches 3 new jobs, stacked on top; total capped at 20
- [ ] "Add to Queue":
  - Creates new application with `status: "to-apply"` in candidate's tracker
  - Auto-generates Tailored CV for this job
  - Auto-generates Cover Letter for this job
  - Saves both as files to candidate's Files tab
  - Toast confirms "CV & CL saved to Files"

---

## 24. Employee — Candidate Detail: FAQ Tab

- [ ] Create new Q&A item (question + answer)
- [ ] Edit answer of existing item → change visible
- [ ] "Approve" button → item marked Approved
- [ ] Cannot edit items locked by candidate (candidate-override lock)
- [ ] Delete FAQ item → removed
- [ ] Each item shows activity log: created, updated, approved, overridden — with timestamps

---

## 25. Super Admin — Overview

- [ ] Navigate to `/superadmin`
- [ ] KPI cards show: Total Candidates (paid + free counts), Active Employees, Total Revenue, Applications Used
- [ ] Monthly revenue chart renders for last 6 months
- [ ] Plan breakdown badges show count per plan name
- [ ] Recent signups list shows last 6 candidates

---

## 26. Super Admin — Plans Management

- [ ] Navigate to `/superadmin/plans`
- [ ] All plans listed with features, price, active/inactive status
- [ ] Add plan → form with all fields → saved and appears in list + on `/pricing` page
- [ ] Edit plan → changes reflected on `/pricing`
- [ ] Toggle active/inactive → inactive plan disappears from public pricing page
- [ ] Delete plan → removed

---

## 27. Super Admin — Candidates Table

- [ ] Navigate to `/superadmin/customers`
- [ ] Table shows all candidates: name, email, signup date, plan badge, status badge, assigned employee
- [ ] Free candidates show "Free" badge; paid show plan name
- [ ] Assigned employee column shows employee name or "Unassigned"
- [ ] Search filters by name or email
- [ ] Filter by plan type and status
- [ ] Expand a row → shows onboarding/marketing summary
- [ ] "View" button → opens candidate detail page

---

## 28. Super Admin — Candidate Detail

- [ ] Navigate to `/superadmin/customers/:id`
- [ ] Header shows candidate name, email, plan, status, assigned employee
- [ ] Stats: apps, interviews, accepted, quota bar
- [ ] Applications section shows full list
- [ ] Onboarding section read-only
- [ ] "Set Custom Limit" → enter new quota → saved → quota bar updates
- [ ] Activity Log at bottom shows last 50 entries: timestamp, action label, detail, author

---

## 29. Super Admin — Employees Management

- [ ] Navigate to `/superadmin/employees`
- [ ] All employees listed with name, email, status, assigned candidate count
- [ ] Add employee → name, email, password, status → saved → employee can now log in
- [ ] Edit employee → update fields → saved
- [ ] Delete employee → removed; their candidates become unassigned
- [ ] Expand employee row → shows assigned candidates list with quota usage
- [ ] Assign candidate from dropdown → candidate appears in employee's list
- [ ] Unassign candidate → removed from employee's list
- [ ] Activity log in expanded row shows last 30 audit entries for this employee

---

## 30. Super Admin — Transactions

- [ ] Navigate to `/superadmin/transactions`
- [ ] Full list with: date, candidate name, plan, amount, method, status badge
- [ ] Search by candidate or plan name
- [ ] Filter by status
- [ ] Add manual transaction → appears in list
- [ ] Edit transaction status (pending → paid) → badge updates
- [ ] Delete transaction → removed

---

## 31. Super Admin — Audit Log

- [ ] Navigate to `/superadmin/audit-log`
- [ ] All platform actions listed with: timestamp, action label, detail, actor, target candidate
- [ ] Filter by date range → works
- [ ] Filter by actor type (employee / candidate) → works
- [ ] Filter by action type → works
- [ ] Export to CSV → file downloads

---

## 32. Cross-Portal Integration Tests

- [ ] **Employee adds application → candidate sees unseen badge**: log in as employee, add app for candidate A, log out, log in as candidate A → unseen badge visible on Applications tab
- [ ] **Employee moves to "Applied" → quota increments**: confirm `applicationsUsed` increments in candidate Profile + in SuperAdmin Candidate Detail
- [ ] **Employee creates FAQ → candidate sees it**: create FAQ item as employee, log in as candidate → item visible in `/candidate/faq` with "Pending Review" status
- [ ] **Candidate locks FAQ → employee blocked**: candidate overrides answer → log in as employee → edit button disabled on that item
- [ ] **Job Discovery → Add to Queue → candidate Files updated**: employee adds job to queue, log in as candidate, open Files → Tailored CV and Cover Letter entries visible
- [ ] **Super admin assigns employee → employee sees candidate**: assign via `/superadmin/employees`, log in as employee → candidate appears in My Candidates
- [ ] **Super admin reassigns to new employee**: old employee loses candidate from My Candidates, new employee gains it
- [ ] **Super admin bumps quota → employee can apply again**: after quota hit, super admin increases limit → employee can mark "Applied" again
