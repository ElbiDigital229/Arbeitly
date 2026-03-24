\# Arbeitly – Employee Portal (Execution Layer)

\---

\#\# 1\. Overview

The Employee Portal is the \*\*execution engine\*\* of Arbeitly.

Employees:  
\- Manage assigned candidates  
\- Use AI-generated assets  
\- Apply to jobs on behalf of candidates  
\- Track and update application progress  
\- Collaborate with candidates (FAQ approvals)

\---

\#\#\# Core Principle:

AI prepares → Employee executes → Candidate validates

\---

\#\# 2\. Access & Authentication

\#\#\# 2.1 Login

Employee logs in using:  
\- Email  
\- Password

(Created by Super Admin)

\---

\#\# 3\. Sidebar Navigation

1\. Candidates    
2\. Files (Global)    
3\. Analytics    
4\. Profile  

\---

\#\# 4\. Module: Candidates

\#\#\# 4.1 Candidate List

Displays:  
\- Only assigned candidates

\---

\#\#\# 4.2 Candidate Row

Includes:  
\- Name  
\- Plan  
\- Application usage (e.g., 45 / 200\)  
\- Status

\---

\#\#\# 4.3 Candidate Detail View

Tabs:

1\. Overview    
2\. CV    
3\. Files    
4\. Account    
5\. Job Discovery    
6\. Applications    
7\. FAQ  

\---

\#\# 5\. Candidate Overview

Displays:  
\- Personal details  
\- Plan details  
\- Onboarding responses  
\- Preferences

\---

\#\#\# Top-Level Stats

\- Signup date    
\- Applications sent    
\- Interviews    
\- Accepted    
\- Rejected    
\- Plan usage (e.g., 5 / 200\)  

\---

\#\# 6\. Module: CV

\#\#\# 6.1 CV Sources

\- Original (candidate)  
\- AI-enhanced (system)  
\- Employee-created versions  
\- Job-specific variants

\---

\#\#\# 6.2 CV Editor

Employee can:  
\- Edit content  
\- Customize structure  
\- Optimize per role/industry

\---

\#\#\# 6.3 Enhance CV (System)

Button: Enhance CV  

Uses:  
→ Admin-defined global prompt  

Output:  
→ Version 2  

\---

\#\#\# 6.4 Controlled Prompting (Employee Layer)

Employee can:  
\- Add custom prompt  
\- Generate further versions

\---

\#\#\# Prompt Execution Logic

Final prompt \=    
Admin Global Prompt \+ Job Context \+ Employee Input  

\---

\#\#\# 6.5 Versioning System

\- V1 → Original    
\- V2 → AI enhanced    
\- V3+ → Employee enhanced    
\- Dynamic → Job-specific  

\---

\#\#\# 6.6 Export & Templates

Employee can export CVs using:  
\- Template A    
\- Template B    
\- Template C  

\---

\#\#\# 6.7 Storage Logic

All CVs:  
\- Saved in Candidate Files    
\- Visible to employee  

\---

\#\#\# Key Rule:

All generated files are shared with the candidate  

\---

\#\# 7\. Module: Files (Candidate-Level)

\#\#\# 7.1 Purpose

Stores all candidate-related files:  
\- CVs  
\- Variants  
\- Cover letters

\---

\#\#\# 7.2 Metadata

Each file includes:  
\- Name    
\- Source (Candidate / Employee / System)    
\- Linked job (optional)    
\- Timestamp  

\---

\#\# 8\. Module: Account (Credentials)

\#\#\# 8.1 Purpose

Quick access to candidate credentials used for job applications  

\---

\#\#\# 8.2 Stored Data

\- Email (dummy account)    
\- Password  

\---

\#\#\# 8.3 Behavior

\- Read-only (initially)    
\- Easily accessible  

\---

\#\#\# Critical Use

Employee uses credentials to:  
→ Apply to jobs externally  

\---

\#\# 9\. Module: Job Discovery

\#\#\# 9.1 Source

Connected to:  
→ Scraper (e.g., Apify)  

\---

\#\#\# 9.2 Job List View

Displays:  
\- Job Title    
\- Company    
\- Location    
\- Tags    
\- AI Matching Score  

\---

\#\#\# 9.3 AI Matching Score

Indicates job relevance  

Based on:  
\- CV    
\- Onboarding data    
\- Job description  

\---

\#\#\# Controlled via:

Admin-defined matching prompt  

\---

\#\#\# 9.4 Filters & Search

Employee can:  
\- Search jobs    
\- Filter by:  
  \- Score    
  \- Role    
  \- Location  

\---

\#\#\# 9.5 Duplicate Detection

System:  
\- Detects duplicate jobs    
\- Flags or removes duplicates  

\---

\#\# 10\. Job Detail View

Displays:  
\- Full job description    
\- Generated CV    
\- Generated cover letter    
\- Instructions (if any)  

\---

\#\#\# Actions:

\- Open job link    
\- Add to Applications  

\---

\#\# 11\. Module: Applications (Inside Candidate)

\#\#\# 11.1 Location

Applications exist inside each candidate  

\---

\#\#\# 11.2 Visibility Rule

Employee sees ONLY:  
\- System-generated jobs    
\- Employee-added jobs  

Does NOT see:  
\- Candidate self-added applications  

\---

\#\#\# 11.3 Kanban Structure

\- To Apply    
\- Applied    
\- Interview    
\- Accepted    
\- Rejected  

\---

\#\#\# 11.4 Workflow

1\. Add job to applications    
2\. Open job    
3\. Review CV \+ cover letter    
4\. Apply externally    
5\. Mark as Applied  

\---

\#\#\# 11.5 Quota Logic

Application counts only when:  
→ Status \= Applied  

\---

\#\# 12\. Module: FAQ

\#\#\# 12.1 Purpose

Handle repeated job application questions  

\---

\#\#\# 12.2 Creation

Employee adds:  
\- Question    
\- Answer  

\---

\#\#\# 12.3 Status

\- Pending Approval    
\- Approved  

\---

\#\#\# 12.4 Candidate Actions

Candidate can:  
\- Approve    
\- Reject/edit  

\---

\#\#\# 12.5 Employee Approval

Employee can approve if:  
\- Confirmed externally (e.g., WhatsApp)  

\---

\#\#\# 12.6 Versioning

Each FAQ includes:  
\- Edit history    
\- Versions    
\- Timestamps  

\---

\#\#\# 12.7 Metadata

\- Created by    
\- Edited by    
\- Timestamp  

\---

\#\# 13\. Module: Files (Global)

\#\#\# 13.1 Purpose

Employee’s personal workspace  

\---

\#\#\# 13.2 Includes

\- Templates    
\- Prompt experiments    
\- Draft CVs    
\- Reference documents  

\---

\#\#\# 13.3 Rule

\- Not visible to candidates    
\- Not linked unless explicitly used  

\---

\#\# 14\. Module: Analytics

\#\#\# 14.1 Overview Metrics

\- Total Applications Completed    
\- Total Candidates Managed    
\- Total Documents Generated  

\---

\#\#\# 14.2 Performance Metrics

\- Interview Rate    
\- Acceptance Rate    
\- Rejection Rate  

\---

\#\#\# 14.3 Time-Based Metrics

\- Applications over time    
\- Daily / weekly trends  

\---

\#\#\# 14.4 Status Breakdown

\- To Apply    
\- Applied    
\- Interview    
\- Accepted    
\- Rejected  

\---

\#\#\# 14.5 Per Candidate Metrics (Optional)

\- Performance per candidate  

\---

\#\# 15\. Module: Profile

\#\#\# 15.1 Employee Details

\- Name    
\- Email    
\- Created date  

\---

\#\#\# 15.2 Security

\- Change password  

\---

\#\#\# 15.3 Activity Log

Tracks:  
\- CV edits    
\- Applications processed    
\- FAQ actions  

\---

\#\# 16\. Ownership & Audit System

Tracks:  
\- Who created CV    
\- Who edited CV    
\- Who created FAQ    
\- Who applied to job  

\---

\#\#\# Purpose:

\- Accountability    
\- Reassignment safety    
\- Traceability  

\---

\#\# 17\. Candidate Reassignment

Admin can:  
\- Reassign candidate  

System ensures:  
\- History preserved    
\- Ownership visible  

\---

\#\# 18\. System Flow

1\. Candidate onboarded    
2\. Assigned to employee    
3\. Jobs scraped    
4\. AI generates CV \+ cover letter    
5\. Employee reviews    
6\. Employee applies    
7\. FAQ used if needed    
8\. Status updated    
9\. Candidate sees progress  

\---

\#\# 19\. Core Principles

\- Candidate-centric    
\- AI-first    
\- Fast execution    
\- Transparent system    
\- Fully accountable  

\---

\#\# 20\. Summary

The Employee Portal is:

A \*\*candidate-centric execution system\*\*

Where:  
\- Each candidate has their own pipeline    
\- AI prepares everything    
\- Employee executes efficiently    
\- Candidate collaborates when needed    
