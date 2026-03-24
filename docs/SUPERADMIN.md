# Arbeitly — Super Admin

## Who They Are
The super admin is the platform operator — the internal Arbeitly team member who oversees everything. They manage pricing plans, candidates, employees, transactions, AI configuration, the job scraper, and the full audit trail. There is one super admin account. They do not manage their own job applications.

---

## How They Access the Platform
1. Navigate to `/superadmin/login`
2. Enter super admin credentials
3. Redirected to `/superadmin` (Overview)

---

## What They Can Access

| Page | Route | Description |
|---|---|---|
| Overview | `/superadmin` | KPI dashboard + revenue chart + recent signups |
| Plans | `/superadmin/plans` | CRUD for pricing plans |
| Customers | `/superadmin/customers` | Full candidate table with assignment, plan, and status |
| Candidate Detail | `/superadmin/customers/:id` | Deep view of one candidate + activity log |
| Employees | `/superadmin/employees` | Manage employee accounts + view their assigned candidates |
| Transactions | `/superadmin/transactions` | Full payment history |
| AI Config | `/superadmin/ai-config` | Toggle AI features, set model, API key |
| CV Prompts | `/superadmin/cv-prompts` | Manage system prompts used for CV generation |
| CL Prompts | `/superadmin/cl-prompts` | Manage system prompts used for cover letter generation |
| Scraper | `/superadmin/scraper` | Job scraper config (sources, filters, schedule) |
| Onboarding Config | `/superadmin/onboarding` | Edit onboarding form fields and section labels |
| Audit Log | `/superadmin/audit-log` | Global full-platform audit log |
| Settings | `/superadmin/settings` | Platform-level settings |
| Profile | `/superadmin/profile` | Super admin account info |

---

## Core Flows

### Overview Dashboard
- **KPI cards**:
  - Total Candidates (paid count badge + free count badge)
  - Active Employees
  - Total Revenue (sum of all `status: "paid"` transactions)
  - Applications Used (sum of `applicationsUsed` across all candidates)
- **Monthly revenue bar chart**: Last 6 months, revenue + transaction count per month
- **Plan breakdown**: Badge count per plan name
- **Recent signups**: Last 6 candidates by `signedUpAt`, showing name, email, plan badge, status

### Plans
- View all pricing plans (active and inactive)
- Add a new plan: name, price, billing type, application limit, CV creation limit, features list (each with include/exclude toggle)
- Edit an existing plan: same fields
- Toggle plan active/inactive (affects whether it appears on `/pricing`)
- Delete a plan
- Each plan has: `name`, `price`, `priceSuffix`, `billing`, `displayPrice`, `totalLabel`, `popular`, `free`, `isActive`, `applicationLimit`, `cvCreationLimit`, `features[]`

### Customers (Candidates Table)
- Paginated table of all candidates
- Columns: Name + email, Signed Up date, Plan badge, Status badge, Assigned Employee (or "Unassigned"), Actions
- **Search**: by name or email
- **Filter**: by plan type (Free / Paid) and status (Active / Inactive / Suspended)
- **Expandable row**: shows candidate's onboarding summary (field, location, how they heard)
- **View button**: opens `/superadmin/customers/:id` for deep detail
- **Inline edit**: plan, status, and quota can be changed from the table

### Candidate Detail (`/superadmin/customers/:id`)
- Header: name, email, plan badge, status, assigned employee
- Stats: total applications, interviews, accepted, quota usage (progress bar)
- **Applications section**: full list of all applications for this candidate with status, company, date
- **Onboarding section**: read-only view of all onboarding answers (full paid onboarding if paid; marketing data only if free)
- **Quota override**: "Set Custom Limit" button → enter number → updates `applicationQuota` on `CandidateAssignment`
- **Activity Log** (at bottom): all `AuditLog` entries for this candidate, last 50, showing:
  - Timestamp (relative + absolute)
  - Action label (human-readable from `auditActionLabels` map)
  - Detail string (e.g. "Marked Applied: Software Engineer at Acme Corp")
  - Author (employee name or "Candidate")

### Employees
- Table of all employee accounts
- Columns: Name, Email, Status (Active / Inactive), Assigned Candidates count, Actions
- **Add Employee**: name, email, password, status → creates account (employee logs in at `/employee/login`)
- **Edit Employee**: update name, email, password, status
- **Delete Employee**: removes account; their assigned candidates become unassigned
- **Expandable row per employee**:
  - List of assigned candidates (name, field, apps used / quota)
  - Assign new candidate: dropdown of unassigned candidates → adds `candidateId` to `employee.assignedCandidateIds`
  - Unassign candidate: removes from list
  - **Activity Log**: last 30 audit entries for this employee showing timestamp, action, target candidate name

### Transactions
- Full payment history for all candidates
- Columns: Date, Candidate name, Plan name, Amount, Method (Stripe / Manual), Status badge (paid / pending / refunded / cancelled)
- **Search** by candidate name or plan name
- **Filter** by status
- **Add Transaction** manually: candidate, plan, amount, method, status, date
- **Edit Transaction**: update status (e.g. mark pending → paid)
- **Delete Transaction**

### AI Config
- Enable/disable AI features globally
- Set active AI model (e.g. GPT-4o, Claude Sonnet)
- Enter/update API key
- Toggle individual features: CV generation, Cover Letter generation, Job Matching

### CV & Cover Letter Prompts
- View and edit the system prompts used when generating CVs and cover letters
- Separate management pages for CV prompts (`/superadmin/cv-prompts`) and CL prompts (`/superadmin/cl-prompts`)
- Each prompt has: title, content, active toggle
- Active prompt is used by employee Job Discovery generation

### Scraper Config
- Configure job scraper: target sources (LinkedIn / Indeed / StepStone / Xing), refresh interval, max jobs per candidate, filters (location, job type, salary range)
- Enable/disable scraper globally

### Onboarding Config
- Edit the labels and field order of the paid onboarding form
- Toggle individual fields on/off
- Changes affect the form shown to new paid candidates at `/onboarding`

### Audit Log (Global)
- Full platform-wide log of all actions
- Columns: Timestamp, Action, Detail, Actor (employee or candidate), Target candidate
- Filter by: date range, actor type (employee / candidate), action type
- Export to CSV
- Entries are created by: employees (applications, status changes, file saves, FAQ edits) and candidates (logins, edits, FAQ overrides)

---

## How the Super Admin Affects Other Users

### → Free Candidate
- Can see their name, email, sign-up date, plan (Free), and simple onboarding/marketing answers
- Can upgrade their plan → immediately unlocks Onboarding, FAQ, Billing tabs in candidate portal
- Can change their status (active / inactive / suspended) → inactive prevents login

### → Paid Candidate
- Can view full profile and onboarding data
- Can bump application quota (`applicationsUsed / applicationQuota`) via "Set Custom Limit"
- Can reassign them to a different employee → old employee loses access, new employee inherits all data
- Can view full activity log showing everything the candidate and their employee have done
- Revenue from this candidate appears in Transactions

### → Employee
- Creates and manages employee accounts (only super admin can create employees)
- Assigns candidates to employees → unlocks candidate in employee's "My Candidates" list
- Can view employee's assigned candidate workload and audit trail in the expanded row
- Can delete employee → candidates become unassigned
- Employee's performance visible via: applications marked "Applied" per candidate, quota burn rate

---

## Edge Cases
- Super admin upgrades a free candidate to paid → FAQ, Onboarding, Billing tabs appear for candidate on next page load without re-login
- Super admin deletes an employee → their `assignedCandidateIds` are removed; those candidates show "Unassigned" in the Customers table
- Super admin edits a plan's price after candidates have paid → existing transactions retain their recorded amount (price at time of transaction); plan price change only affects future signups
- Super admin sets `applicationQuota` to 0 → employee cannot mark any applications as "Applied" for that candidate
- Super admin deactivates a candidate → they can no longer log into their portal
- Super admin views audit log for a candidate with no employee assigned → log only shows candidate's own actions
