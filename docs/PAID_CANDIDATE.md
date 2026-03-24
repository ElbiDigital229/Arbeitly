# Arbeitly — Paid Candidate

## Who They Are
A paid candidate is a managed-service user. They have paid for a plan (Starter, Professional, or higher) and are assigned to an employee who applies to jobs on their behalf using AI-generated CVs and cover letters. The paid candidate retains full visibility and control — they can see everything the employee does, approve/reject decisions, and manage their own materials in parallel.

---

## How They Sign Up
1. Visit `/pricing` → select a paid plan → click "Get Started"
2. Fill account details (name, email, password)
3. Redirected to `/payment` with plan pre-selected
4. Complete payment
5. Redirected to `/onboarding` — full multi-section onboarding form
6. Complete onboarding → redirected to `/candidate/applications`
7. Super admin assigns an employee to them via the Employees page

---

## What They Can Access

| Page | Route | Access |
|---|---|---|
| Applications | `/candidate/applications` | ✅ Full |
| CV Builder | `/candidate/cv` | ✅ Full |
| Files | `/candidate/files` | ✅ Full |
| Profile & Settings | `/candidate/profile` | ✅ Full |
| Analytics | `/candidate/analytics` | ✅ Full |
| Onboarding | `/candidate/onboarding` | ✅ Full (paid only) |
| FAQ | `/candidate/faq` | ✅ Full (paid only) |
| Billing | `/candidate/billing` | ✅ Full (paid only) |

---

## Core Flows

### Applications
- Same as free candidate PLUS:
- Applications added by their assigned employee appear here automatically
- New employee-added applications show an **unseen badge** on the Applications tab
- Candidate can see who added each application (employee name shown)
- Candidate can edit notes and status on all applications
- When employee moves an application to "Applied" → quota decrements

### Onboarding (Paid Only)
- Detailed profile: personal info, current job, employer, field, years of experience, current salary
- Education: degree, university, location
- Skills: top skills, certifications
- Career goals: target roles, industries, preferred location, salary expectations, employment type
- Germany-specific: German language level, driving license, worked in Germany before, notice period
- This data powers the employee's **Job Discovery** and **CV/CL generation**

### FAQ (Paid Only)
- Employee creates Q&A pairs on behalf of the candidate (common interview questions, background queries)
- Candidate reviews answers in their FAQ tab
- Candidate can: approve an answer, edit and resubmit, or override and lock it
- Locked answers cannot be edited by the employee
- Activity log shows every change with timestamp and author

### Billing (Paid Only)
- Full transaction history: date, plan name, amount, payment method, status (Paid / Pending / Refunded)
- Download individual invoices as PDF
- Invoice includes: Arbeitly branding, invoice number, billed-to name, line item (plan), amount, transaction ID

### CV Builder & Files
- Same as free candidate
- Employee may generate tailored CVs via Job Discovery — these auto-save to the Files tab as `.txt` entries labelled "Tailored CV — [Role] @ [Company]"
- Candidate can see all employee-generated documents in their Files

---

## Application Quota
- Quota set by plan (e.g. 200 applications on Starter)
- Quota is tracked per candidate-employee assignment: `applicationsUsed / applicationQuota`
- **Quota decrements when**: an application is moved to status "Applied" (not when it's added to queue)
- Progress bar in Profile shows current usage
- Super admin can manually bump the quota from the candidate detail page
- When quota is reached: employee cannot add more applications to "Applied" state; super admin must increase limit

---

## How a Paid Candidate Affects Other Users

### → Employee
- Appears in employee's "My Candidates" list immediately after super admin assigns them
- Employee sees: name, email, field, location, total apps, interviews, accepted
- Employee can open full candidate detail: all 9 tabs (Profile, Onboarding, Applications, CV, Cover Letter, Files, Account, Job Discovery, FAQ)
- Employee's Job Discovery uses the candidate's onboarding data to generate tailored jobs and documents
- When employee adds an application → it appears in the candidate's portal with unseen badge
- When employee marks application as "Applied" → quota counter increments for this candidate
- Employee's activity is logged in the audit trail and visible on the candidate's profile

### → Super Admin
- Appears in Candidates table with paid plan badge and price
- Super admin sees: assigned employee name (or "Unassigned") in the table
- Super admin can view full onboarding profile in the expandable row
- Super admin can click "View" → candidate detail page showing:
  - Applications with stats (total, interviews, accepted)
  - Full onboarding data
  - Quota usage with progress bar and "Set Custom Limit" button
  - Activity log of all actions (by candidate and employee)
- Super admin can edit plan, status, and quota
- Super admin can reassign to a different employee
- Revenue from this candidate appears in Transactions and Overview chart

---

## Cross-Portal Interactions in Detail

```
Paid Candidate Signs Up
        ↓
Super Admin sees them in Candidates table (Free badge initially → updated after payment)
        ↓
Super Admin assigns Employee via Employees page
        ↓
Employee sees Candidate in "My Candidates" list
        ↓
Employee opens Candidate → Job Discovery tab → generates tailored CV + Cover Letter
        ↓
Employee clicks "Add to Queue" → Application added to Candidate's tracker
                               → CV + CL auto-saved to Candidate's Files
        ↓
Candidate sees new application with unseen badge
        ↓
Employee moves application to "Applied" → quota decrements
        ↓
Super Admin sees quota usage in Candidate detail
        ↓
If quota exhausted → Super Admin bumps the limit
        ↓
Employee creates FAQ Q&A for Candidate
        ↓
Candidate reviews FAQ, approves or overrides answers
        ↓
All of above logged in Audit Log visible to Super Admin
```

---

## Edge Cases
- Paid candidate completes payment but doesn't complete onboarding → employee can still see them but Job Discovery will produce generic results without profile data
- Paid candidate overrides a FAQ answer → employee tries to edit it → edit should be blocked (candidate-locked)
- Paid candidate's quota hits 0 → employee cannot move any more applications to "Applied" → super admin must intervene
- Paid candidate is reassigned to a new employee → old employee loses access, new employee inherits all applications and FAQ history
- Paid candidate downloads invoice for a plan that has since been edited → invoice should reflect the price at the time of transaction, not the current plan price
- Paid candidate is downgraded to free by super admin → FAQ, Onboarding, Billing tabs disappear; their data is not deleted but hidden
