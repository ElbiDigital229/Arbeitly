# Arbeitly — Business Logic

Core rules that govern data, state changes, and cross-user effects across the platform.

---

## 1. Application Quota System

### How quota is tracked
- Each candidate-employee assignment stores two fields: `applicationsUsed` and `applicationQuota`
- `applicationQuota` is set by the plan at signup (e.g. Starter = 200)
- `applicationsUsed` starts at 0

### When quota decrements
- **Only** when an application's status changes **to** `"applied"` from any other status
- Does not decrement when an application is created (even in "to-apply" or any other pre-applied state)
- Does not refund when status moves **away from** `"applied"` back to another status (by design — the application was submitted)

### Quota enforcement
- If `applicationsUsed >= applicationQuota`: employee cannot change any application to `"applied"` for that candidate
- Candidate still cannot be blocked from adding applications to other statuses (e.g. "to-apply", "interview")
- Super admin can override with "Set Custom Limit" at any time — immediate effect

### Free candidate quota
- Free candidates also have a quota (lower, set via the Free plan config in Plans)
- Quota enforced at the "Add Application" button level — cannot add new applications when limit is reached
- Upgrading plan immediately applies the new plan's quota

---

## 2. Application Source Tagging

Every application record carries a `source` field:

| Value | Meaning |
|---|---|
| `"self"` | Added by the candidate through their own portal |
| `"platform"` | Added by an employee on behalf of the candidate |

Additional fields when `source === "platform"`:
- `addedById`: employee ID
- `addedByName`: employee's full name at the time of creation

### Visibility rules
- Candidate sees **all** applications regardless of source
- Employee sees **only** their own platform-added applications (not self-added by candidate)
- Employee can **edit and delete** only applications they added (`addedById === currentEmployee.id`)

### Unseen badge
- When an employee adds an application, it is tagged `seen: false`
- The unseen badge on the candidate's Applications tab fires if any application is `seen: false`
- Badge clears when the candidate opens the Applications tab (all `seen` set to `true`)

---

## 3. FAQ Locking Rules

| State | Employee can edit? | Candidate can edit? |
|---|---|---|
| Employee-created (pending) | ✅ Yes | ✅ Yes |
| Candidate-approved | ✅ Yes | ✅ Yes |
| Candidate-overridden (locked) | ❌ No | ✅ Yes |

- "Candidate override lock" is set when the candidate edits an employee-written answer
- Once locked, only the candidate can edit that item — employee edit UI is disabled
- Lock is permanent until the candidate edits again (re-locks under their name) or the item is deleted

---

## 4. Employee Assignment Model

- An employee has an `assignedCandidateIds: string[]` array
- Super admin controls assignment entirely — neither employee nor candidate can change it
- A candidate can be assigned to **one employee at a time** (one-to-many: one employee → many candidates)
- Reassigning: old employee's `assignedCandidateIds` loses the ID, new employee's gains it
- After reassignment: old employee loses all access to that candidate's detail view; new employee inherits all existing data (applications, FAQ, files, audit log)
- Free candidates can be assigned to an employee but Job Discovery will produce generic results due to missing onboarding data

---

## 5. Job Discovery Generation Rules

- Jobs are generated (simulated) using candidate's onboarding data:
  - Target roles → job titles
  - Preferred location → job location
  - Salary expectations → salary range
  - Years of experience + field + German level → match score calculation
- Up to 20 active (non-skipped) jobs kept per candidate (localStorage key: `arbeitly_jobs_{candidateId}`)
- Refresh adds 3 new jobs; if total exceeds 20, oldest are dropped
- Skipped jobs are stored separately and not counted toward the 20 cap
- Restoring a skipped job adds it back to the active list (counts toward 20)

### CV & Cover Letter generation
- Each discovered job auto-generates a Tailored CV and Cover Letter at generation time
- Uses candidate's real onboarding data: name, email, phone, skills, experience, education, target salary, German level, availability
- CV is formatted as plain text: header block, summary, experience section, education section, skills section, additional info
- Cover Letter is formatted as plain text: salutation, intro referencing the role + company, body referencing candidate's background + goals + German level, closing with availability
- Generated content is stored as `generatedCv` and `generatedCoverLetter` on the job object

### "Add to Queue" flow (atomically):
1. Creates application record in candidate's tracker with `status: "to-apply"`, `source: "platform"`
2. Saves Tailored CV as a file entry in candidate's Files (key `arbeitly_files_{candidateId}`): `name: "Tailored CV — {role} @ {company}"`
3. Saves Cover Letter as a file entry: `name: "Cover Letter — {role} @ {company}"`
4. Deduplication: if a file with the same name already exists, it is replaced (not duplicated)
5. Toast: "CV & CL saved to Files"

---

## 6. File Storage & Deduplication

- Files are stored in localStorage under `arbeitly_files_{candidateId}` as an array of `StoredFile` objects
- `StoredFile` fields: `{ id, name, size, type, uploadedBy, uploadedAt }`
- Deduplication is by `name` (case-sensitive): if a file with the same name is saved again, the existing entry is replaced in-place (same array position)
- Files can be added by: candidate (upload), employee (upload), employee (Job Discovery auto-save), employee (manual Save to Files from Details panel)
- All file entries are visible to both the candidate and the employee on their respective File tabs

---

## 7. Audit Log

Every significant action creates an entry in the global audit log (`AuditLogContext`):
- Stored in localStorage under `arbeitly_audit_log`
- Fields: `{ id, timestamp, action, detail, actorId, actorName, actorType ("employee" | "candidate"), candidateId, candidateName }`

### Actions logged
| Action | Triggered by |
|---|---|
| `application_added` | Employee adds application |
| `application_status_changed` | Employee or candidate changes status |
| `application_deleted` | Employee deletes application |
| `cv_generated` | Employee generates CV |
| `cv_uploaded` | Employee uploads CV |
| `cover_letter_generated` | Employee generates cover letter |
| `file_saved` | File saved to candidate's Files |
| `file_deleted` | File deleted |
| `faq_created` | Employee creates FAQ item |
| `faq_updated` | FAQ answer edited |
| `faq_approved` | Candidate approves FAQ answer |
| `faq_overridden` | Candidate overrides and locks FAQ answer |
| `job_added_to_queue` | Employee adds job to candidate's queue |
| `job_skipped` | Employee skips a discovered job |
| `candidate_login` | Candidate logs in |
| `candidate_profile_updated` | Candidate edits their profile |
| `password_changed` | Candidate changes password |
| `onboarding_updated` | Candidate updates onboarding answers |
| `quota_bumped` | Super admin increases application quota |
| `plan_changed` | Super admin changes candidate's plan |
| `employee_assigned` | Super admin assigns employee to candidate |
| `employee_unassigned` | Super admin removes employee assignment |
| `employee_created` | Super admin creates employee account |
| `employee_deleted` | Super admin deletes employee account |
| `transaction_added` | Transaction recorded |
| `transaction_status_changed` | Transaction status updated |

### Visibility
- Super admin: sees all entries in `/superadmin/audit-log`
- Super admin: sees candidate-scoped entries in Candidate Detail page (last 50)
- Super admin: sees employee-scoped entries in Employees expanded row (last 30)
- Candidate: sees their own actions in Profile activity log
- Employee: no direct audit log view (their actions are logged but visible only to super admin)

---

## 8. Plan & Pricing Rules

- Plans are defined in `PricingContext` (localStorage: `arbeitly_plans`)
- Only **active** plans appear on the public `/pricing` page
- A plan defines: `applicationLimit`, `cvCreationLimit`, `features[]`, `price`, `billing`
- Changing a plan's `applicationLimit` does NOT retroactively change existing candidates' `applicationQuota` — quota is copied at signup time
- Super admin can override any individual candidate's quota independently of their plan

---

## 9. Session & Auth Model (Frontend Simulation)

### Candidate session
- Stored in `localStorage` under `arbeitly_candidate_session`
- Contains: `{ id, email, name, planType, planName, status }`
- Re-read on every protected page load; if absent → redirect to `/candidate/login`

### Employee session
- Stored in `sessionStorage` under `arbeitly_employee_session`
- Contains the full employee object
- `sessionStorage` means it clears on tab close (not a persistent login)
- If absent → redirect to `/employee/login`

### Super admin session
- Stored in `localStorage` (or `sessionStorage` depending on implementation)
- Protected pages under `SuperAdminLayout` check for session on render

### Last-write-wins
- All data is localStorage-based with no server-side locking
- If two browser tabs modify the same candidate's data simultaneously, the last write wins
- No conflict detection or merge logic exists

---

## 10. Plan Type Classification

| Condition | Classified as |
|---|---|
| `customer.planType === "free"` | Free candidate |
| `customer.planType === "paid"` | Paid candidate |

### Features gated to paid only
- Onboarding tab (`/candidate/onboarding`)
- FAQ tab (`/candidate/faq`)
- Billing tab (`/candidate/billing`)
- Full multi-section onboarding form at signup
- Employee assignment eligibility (free candidates can be assigned but have limited value)

### Immediate effect of plan upgrade
- Changing `planType` from `"free"` to `"paid"` via super admin → on next page load, candidate's sidebar and profile update to show paid-only tabs
- No re-login required
- Downgrade (paid → free): paid-only tabs disappear; underlying data (FAQ answers, full onboarding) is NOT deleted — just hidden
