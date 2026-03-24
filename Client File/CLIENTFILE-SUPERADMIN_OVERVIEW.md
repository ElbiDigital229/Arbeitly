\# Arbeitly – Super Admin Portal (Complete Control Layer)

\---

\#\# 1\. Overview

The Super Admin Portal is the \*\*central brain of Arbeitly\*\*.

It controls:  
\- Monetization (Plans & Transactions)  
\- Operations (Employees & Candidates)  
\- Intelligence (AI \+ Prompts)  
\- Automation (Scraper \+ Matching)  
\- Performance (Analytics)

\---

\#\#\# Core Principle:

Admin defines system → System executes → Employees operate → Candidates receive service

\---

\#\# 2\. Access & Authentication

\#\#\# 2.1 Login

\- Email  
\- Password

\---

\#\# 3\. Sidebar Navigation

1\. Dashboard    
2\. Plans    
3\. Candidates    
4\. Employees    
5\. Transactions    
6\. AI Configuration    
7\. Scraper & Matching    
8\. Onboarding Configuration    
9\. Analytics    
10\. Audit Logs    
11\. System Settings    
12\. Profile  

\---

\#\# 4\. Module: Dashboard

\#\#\# 4.1 Overview Metrics

\- Total Candidates (Free vs Paid)  
\- Total Employees  
\- Total Applications Sent  
\- Total Revenue  
\- Active Plans  
\- Conversion Rate

\---

\#\#\# 4.2 Alerts & Insights

\- Candidates nearing quota  
\- Employees with low performance  
\- Scraper issues (if any)

\---

\#\# 5\. Module: Plans

\#\#\# 5.1 Fields

\- Plan Name    
\- Price    
\- Description    
\- Application Limit  

\---

\#\#\# 5.2 Controls

\- Create / Edit / Delete    
\- Activate / Deactivate  

\---

\#\#\# 5.3 Analytics

\- Users per plan    
\- Revenue per plan  

\---

\#\# 6\. Module: Candidates

\#\#\# 6.1 Candidate List

\- Name    
\- Email    
\- Plan    
\- Assigned Employee    
\- Signup Date  

\---

\#\#\# 6.2 Candidate Detail View

Admin can view:

\- Personal details    
\- Plan details    
\- Application usage    
\- Onboarding responses    
\- Files & CVs    
\- Applications    
\- Assigned employee  

\---

\#\#\# 6.3 Actions

\- Assign / reassign employee    
\- Reset password    
\- Upgrade / downgrade plan  

\---

\#\# 7\. Module: Employees

\#\#\# 7.1 Employee List

\- Name    
\- Email    
\- Assigned candidates    
\- Status  

\---

\#\#\# 7.2 Employee Detail View

\- Assigned candidates    
\- Performance metrics    
\- Activity logs  

\---

\#\#\# 7.3 Actions

\- Create employee    
\- Edit employee    
\- Reassign candidates    
\- Activate / deactivate  

\---

\#\# 8\. Module: Transactions

\#\#\# 8.1 Fields

\- Candidate Name    
\- Plan    
\- Amount    
\- Date    
\- Status  

\---

\#\#\# 8.2 Metrics

\- Total revenue    
\- Revenue per plan  

\---

\#\# 9\. Module: AI Configuration (Core IP Layer)

\---

\#\#\# 9.1 LLM Setup

\- Select provider (Claude, Gemini, etc.)  
\- Store API keys

\---

\#\#\# 9.2 Prompt Management

\---

\#\#\#\# CV Enhancement Prompt    
Used when employee clicks enhance

\---

\#\#\#\# Job Tailoring Prompt    
Used for job-specific CV

\---

\#\#\#\# Cover Letter Prompt  

\---

\#\#\#\# Job Matching Prompt    
Controls AI Matching Score

\---

\#\#\# 9.3 Prompt Versioning (IMPORTANT)

System stores:  
\- Prompt versions  
\- Change history  
\- Performance impact (future)

\---

\#\#\# Key Principle:

Prompts \= Business IP

\---

\#\# 10\. Module: Scraper & Matching

\---

\#\#\# 10.1 Scraper Configuration

\- Source (e.g., LinkedIn via Apify)  
\- Frequency (manual / scheduled)  
\- Filters:  
  \- Location    
  \- Job type    
  \- Industry  

\---

\#\#\# 10.2 Job Pipeline

\- View scraped jobs  
\- Clean duplicates  
\- Monitor ingestion

\---

\#\#\# 10.3 Matching Logic

Controlled via:  
\- Prompt  
\- Weightages (future)

\---

\#\#\# 10.4 Duplicate Handling

\- Detect duplicates  
\- Auto-filter or flag

\---

\#\# 11\. Module: Onboarding Configuration

\---

\#\#\# 11.1 Purpose

Control onboarding questions for paid users

\---

\#\#\# 11.2 Features

Admin can:  
\- Add questions    
\- Edit questions    
\- Set required fields    
\- Reorder questions  

\---

\#\#\# 11.3 Types

\- Text    
\- Dropdown    
\- Multi-select  

\---

\#\# 12\. Module: Analytics

\---

\#\#\# 12.1 Platform Analytics

\- Applications over time    
\- Conversion rate    
\- Interview rate  

\---

\#\#\# 12.2 Employee Analytics

Per employee:

\- Applications completed    
\- Interview rate    
\- Acceptance rate    
\- Documents generated  

\---

\#\#\# 12.3 Candidate Analytics

\- Progress per candidate    
\- Success rates  

\---

\#\#\# 12.4 Comparative View

\- Rank employees    
\- Compare performance  

\---

\#\# 13\. Module: Audit Logs

\---

\#\#\# 13.1 Tracks

\- CV edits    
\- Application updates    
\- FAQ changes    
\- Prompt updates    
\- Assignments  

\---

\#\#\# 13.2 Metadata

\- Action    
\- User (Admin / Employee)    
\- Timestamp  

\---

\#\# 14\. Module: System Settings

\---

\#\#\# 14.1 General

\- Platform name    
\- Default settings  

\---

\#\#\# 14.2 Quota Rules

\- When to deduct application    
→ Only when status \= Applied  

\---

\#\#\# 14.3 Permissions (Future)

\- Role-based controls  

\---

\#\# 15\. Module: Profile

\---

\#\#\# 15.1 Admin Info

\- Name    
\- Email  

\---

\#\#\# 15.2 Security

\- Change password  

\---

\#\#\# 15.3 Activity Log

\- System-level actions  

\---

\#\# 16\. Core Business Logic

\---

\#\#\# 16.1 Candidate Assignment

\- One candidate → one employee    
\- One employee → many candidates  

\---

\#\#\# 16.2 Quota Logic

\- Belongs to candidate    
\- Consumed when application marked "Applied"  

\---

\#\#\# 16.3 Visibility

Admin can see:  
\- All data    
\- All files    
\- All applications  

\---

\#\#\# 16.4 Ownership Tracking

System logs:  
\- CV creation/edit    
\- Application execution    
\- FAQ edits  

\---

\#\#\# 16.5 Reassignment Safety

\- No data loss    
\- Full history preserved  

\---

\#\# 17\. System Role Architecture

| Role        | Responsibility |  
|------------|---------------|  
| Super Admin | Control \+ intelligence |  
| Employee    | Execution |  
| Candidate   | Usage |

\---

\#\# 18\. Summary

The Super Admin Portal is:

→ The \*\*complete operating system controller\*\*

Where:

\- Plans drive revenue    
\- Employees drive execution    
\- AI drives quality    
\- Analytics drives decisions    
