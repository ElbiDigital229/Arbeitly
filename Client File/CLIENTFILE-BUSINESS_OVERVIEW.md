\# Arbeitly – Business Overview & Core Logic

\---

\#\# 1\. Core Concept

Arbeitly is a hybrid SaaS \+ service platform that helps candidates apply for jobs in Germany.

Instead of candidates manually applying to jobs, Arbeitly:  
\- Assists (Free Plan)  
\- Or fully executes applications (Paid Plan)

\---

\#\# 2\. Value Proposition

\#\#\# For Candidates:  
\- Save time applying to jobs  
\- Improve CV quality and relevance  
\- Track all applications in one place  
\- Get done-for-you job applications (paid)

\---

\#\#\# For Business (Arbeitly):  
\- Scalable service model  
\- Structured employee workflows  
\- Centralized performance tracking  
\- Recurring revenue via plans

\---

\#\# 3\. Platform Architecture

The system operates on 4 core layers:

\#\#\# 1\. Candidate Layer  
\- Free users (self-service tools)  
\- Paid users (managed service)

\---

\#\#\# 2\. Employee Layer  
\- Executes applications  
\- Uses AI-generated assets  
\- Manages assigned candidates

\---

\#\#\# 3\. Admin Layer  
\- Controls plans  
\- Assigns candidates  
\- Manages employees  
\- Controls AI logic

\---

\#\#\# 4\. Intelligence Layer (AI \+ Automation)  
\- Job scraping  
\- Candidate-job matching  
\- CV \+ cover letter generation

\---

\#\# 4\. Plan System

\#\#\# 4.1 Free Plan

Purpose:  
\- Acquisition  
\- Engagement  
\- Upsell

Includes:  
\- CV builder  
\- File storage  
\- Application tracker  
\- Limited exports

\---

\#\#\# 4.2 Paid Plans

Purpose:  
\- Done-for-you service

Includes:  
\- Application quota (e.g., 200 jobs)  
\- Employee-managed applications  
\- AI-powered CV \+ cover letter generation  
\- Progress tracking

\---

\#\# 5\. Core Business Logic

\---

\#\#\# 5.1 Candidate ↔ Employee Mapping

\- Each candidate is assigned to \*\*one employee\*\*  
\- Each employee can manage \*\*multiple candidates\*\*

Purpose:  
\- Accountability  
\- Work distribution  
\- Performance tracking

\---

\#\#\# 5.2 Application Quota System

\- Each paid plan includes a fixed number of applications  
\- System tracks:  
  \- Applications used  
  \- Applications remaining

\---

\#\#\# 5.3 Transparency Layer

All actions are logged and visible:

\- Job applied  
\- Timestamp  
\- CV used  
\- Status updates

\---

\#\#\# 5.4 Application Source Types

Applications can originate from:

1\. Candidate (manual)  
2\. Employee (manual)  
3\. System (AI \+ scraper)

Each application must include:  
\- Source tag  
\- Linked CV  
\- Status timeline

\---

\#\# 5.5 Automated Job Sourcing & AI Application Engine

\---

\#\#\# 5.5.1 Job Scraping Layer

\- Integrated with tools like Apify  
\- Pulls jobs from LinkedIn and other platforms

Extracted data:  
\- Job title  
\- Company  
\- Description  
\- Location  
\- URL  
\- Salary (if available)

\---

\#\#\# 5.5.2 Candidate Matching Logic

System evaluates:  
\- Onboarding data  
\- CV content  
\- Preferences

Outputs:  
→ Relevant jobs per candidate

\---

\#\#\# 5.5.3 AI CV & Cover Letter Generation

For each job:

System:  
\- Reads job description  
\- Extracts requirements  
\- Generates:  
  \- Tailored CV  
  \- Cover letter

\---

\#\#\# 5.5.4 Application Preparation

Each job includes:  
\- Job details  
\- Suggested CV  
\- Suggested cover letter  
\- Application link

\---

\#\#\# 5.5.5 Employee Execution

Employee:  
1\. Reviews job  
2\. Uses generated CV  
3\. Applies externally  
4\. Updates status

\---

\#\# 5.6 AI Prompt Control & Intelligence Layer

\---

\#\#\# 5.6.1 LLM Integration

Supports:  
\- Claude (Opus)  
\- Gemini  
\- Future models

\---

\#\#\# 5.6.2 Global Prompt System

Admin defines:

\- CV Enhancement Prompt  
\- Job Tailoring Prompt  
\- Cover Letter Prompt

\---

\#\#\# Key Principle:

\> The system’s intelligence is controlled via prompts (Admin IP)

\---

\#\#\# 5.6.3 CV Versioning System

Each CV evolves:

\- V1 → Original  
\- V2 → AI enhanced (global prompt)  
\- V3+ → Employee refined  
\- Dynamic → Job-specific variants

\---

\#\#\# Example:

\- CV – SaaS Base  
\- CV – Google Variant  
\- CV – Berlin Startup Variant

\---

\#\#\# 5.6.4 Job-Specific CV Generation

For each job:

1\. Select base CV  
2\. Apply job-specific prompt  
3\. Generate new variant  
4\. Label by company/job

\---

\#\#\# 5.6.5 Human \+ AI Collaboration

\- AI prepares  
\- Employee executes  
\- Admin controls logic

\---

\#\# 5.7 Application Object Model

Each application includes:

\#\#\# Core Fields:  
\- Job Title  
\- Company  
\- URL  
\- Description

\---

\#\#\# Metadata:  
\- Source (Self / Employee / System)  
\- Added by (user reference)

\---

\#\#\# Assets:  
\- CV used  
\- Cover letter used

\---

\#\#\# Status:  
\- To Apply  
\- Applied  
\- Interview  
\- Accepted  
\- Rejected

\---

\#\#\# Timeline:  
\- Created  
\- Updated timestamps

\---

\#\# 6\. Data System Overview

\---

\#\#\# Candidate Data:  
\- Profile info  
\- Marketing data (free users)  
\- Onboarding responses (paid users)

\---

\#\#\# CV Data:  
\- Raw CV  
\- Edited CV  
\- Versions  
\- Job-specific variants

\---

\#\#\# Application Data:  
\- Job info  
\- Status  
\- CV linkage  
\- Source

\---

\#\#\# Employee Data:  
\- Assigned candidates  
\- Activity logs

\---

\#\#\# Admin Data:  
\- Plans  
\- Transactions  
\- AI prompts

\---

\#\# 7\. System Workflow (End-to-End)

\---

\#\#\# Free User Flow:

1\. Signup    
2\. Create/edit CV    
3\. Export CV    
4\. Track applications    
5\. Hit limitation → upgrade  

\---

\#\#\# Paid User Flow:

1\. Signup \+ payment    
2\. Complete onboarding    
3\. Assigned to employee    
4\. Jobs are scraped \+ matched    
5\. CVs generated automatically    
6\. Employee applies    
7\. Candidate tracks progress  

\---

\#\# 8\. Core System Goals

\- Scale job applications efficiently  
\- Maintain high quality via AI \+ prompts  
\- Ensure transparency for users  
\- Optimize conversion rates  
\- Enable operational control

\---

\#\# 9\. Summary

Arbeitly is not just a job application tool.

It is:

→ A \*\*job application operating system\*\*

Where:

\- AI generates optimized application materials    
\- Employees execute at scale    
\- Admin controls intelligence via prompts    
\- Candidates receive outcomes with full visibility    
