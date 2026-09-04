The Job Connections

A professional recruitment and employment platform designed to connect qualified Filipino workers with overseas job opportunities and recruitment services.

The website provides a modern, responsive, and user-friendly interface where applicants can explore job opportunities, view job details, submit job applications, send inquiries, and access recruitment-related services.

The frontend communicates with a Laravel-based backend API for dynamic job postings and job application submissions.

Overview

The Job Connections is a production-deployed recruitment website developed to provide a digital platform for overseas employment opportunities and recruitment services.

The website supports recruitment operations by providing:

Overseas job opportunity listings
Dynamic job postings retrieved from the backend API
Individual job details
Online job application workflow
Recruitment service information
Applicant inquiry submission
Responsive design for desktop, tablet, and mobile devices
Interactive modals and user-friendly forms
Loading, empty, and error states
API-driven frontend functionality

The frontend follows a lightweight and maintainable architecture using Vite, Vanilla JavaScript, HTML5, and Tailwind CSS.

Key Features
Job Opportunities

Job opportunities are dynamically retrieved from the Laravel backend API instead of being hardcoded into the website.

Applicants can:

Browse available job openings
View job titles
View destination countries
View posting dates
Open detailed job information
Proceed directly to the application process

Job postings are managed through the backend administration system.

Job Details

Each published job posting can be opened through a dedicated job details modal.

The job details include:

Job title
Country
Posting date
Job description
Application action

The frontend uses the job posting UUID to identify and process the selected job.

Job Application

The website provides an application form that allows applicants to apply for a selected job opportunity.

Application fields include:

First name
Last name
Middle name
Contact number
Email address
Cover letter
Resume
Terms and conditions acceptance
Selected job reference

The selected job UUID is passed to the backend as the job reference when submitting an application.

The application workflow communicates with the Laravel backend API so submitted applications can be processed by the administrative system.

Inquiry Form

Visitors can submit inquiries through the website.

The inquiry form communicates with the backend API and allows recruitment-related questions and concerns to be submitted to the organization.

Complaint Form

The website includes a complaint submission interface for applicants and overseas Filipino workers.

The frontend complaint form supports:

OFW information
Foreign recruitment agency
Contact information
Address abroad
Complaint details
Location coordinates
Evidence uploads

Development Status: The complaint form interface is implemented on the frontend. Backend API integration and submission testing are scheduled for the next development phase.

Location Detection

The complaint form supports browser-based geolocation.

Users can select Use My Location to retrieve their current geographic coordinates.

The frontend can also use reverse geocoding to convert latitude and longitude into a readable address.

Responsive Design

The website is designed to provide a consistent experience across:

Desktop
Laptop
Tablet
Mobile devices

Responsive layouts and adaptive components are used throughout the website.

Interactive UI

The website includes interactive components such as:

Job detail modals
Application form modals
Inquiry forms
Mobile navigation
Loading states
Empty states
Error states
Interactive buttons
Lucide icons
Scroll animations

Animations are implemented using Motion.

API Integration

The frontend communicates with a Laravel REST API hosted by the backend system.

Job Posts

Published job postings are retrieved dynamically from the backend.

GET /api/v1/job-post/{agency}

The frontend uses the agency UUID to retrieve the corresponding published job postings.

Job Details

Individual job postings can be retrieved using the job UUID.

GET /api/v1/job-post/get/{jobPost}
Job Application

Applications can be submitted to the backend using the agency UUID.

POST /api/v1/application/{agency}

The selected job UUID is included in the application request as:

job_id

The backend validates the submitted application before processing it.

Job-Specific Application

The backend also provides a job-specific application endpoint:

POST /api/v1/application/{agency}/job/{jobPost}

This allows an application to be directly associated with a specific job posting.

Application Validation

The backend application endpoint validates the following fields:

Field	Requirement
First Name	Required, max 100 characters
Last Name	Required, max 100 characters
Middle Name	Required, max 100 characters
Contact Number	Required, max 100 characters
Email	Required, valid email, max 100 characters
Cover Letter	Required, max 300 characters
Terms & Conditions	Required and must be accepted
Resume	Required file
Job ID	Required

Frontend validation is implemented to provide users with immediate feedback before submitting the application.

Technology Stack
Frontend
HTML5
Vanilla JavaScript
Tailwind CSS
Vite
Motion
Lucide Icons
Backend

The frontend communicates with a Laravel-based backend API.

Backend technologies include:

Laravel
PHP
REST API
MySQL
Filament Admin Panel
Laravel API Resources
Laravel Form Requests
Spatie Media Library
Development Tools
Visual Studio Code
Git
GitHub
NPM
Vite Development Server
Project Structure
thejobconnections/
│
├── public/
│   ├── components/
│   │   ├── navbar.html
│   │   ├── contact.html
│   │   ├── services.html
│   │   ├── request-modal.html
│   │   └── ...
│   │
│   ├── images/
│   │   ├── job1.png
│   │   ├── job2.png
│   │   ├── job3.png
│   │   ├── job4.png
│   │   └── ...
│   │
│   └── assets/
│
├── src/
│   ├── js/
│   │   ├── jobs.js
│   │   ├── contact.js
│   │   ├── complaint.js
│   │   ├── assistance.js
│   │   └── ...
│   │
│   ├── styles/
│   │   └── ...
│   │
│   └── main.js
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
Frontend Architecture

The project uses a modular Vanilla JavaScript architecture.

Dynamic functionality is separated into individual JavaScript modules based on the feature they control.

For example:

src/js/jobs.js

is responsible for:

Fetching job postings
Rendering job cards
Handling job details
Opening and closing the job details modal
Selecting the active job
Connecting the selected job to the application workflow
Handling loading, empty, and error states

This approach keeps the project organized without introducing a frontend framework such as React or Vue.

Backend Administration

Job postings are managed through the backend administration system.

Administrators can create and publish job opportunities from the administrative panel.

Once a job is published, the frontend retrieves the available job data through the API and displays it automatically.

This removes the need to manually modify the frontend source code whenever a new job opportunity is added.

Data Flow
Admin Portal
     │
     │ Create / Publish Job
     ▼
Laravel Backend
     │
     │ REST API
     ▼
Frontend Website
     │
     ├── Job Listings
     ├── Job Details
     └── Application Form
Application Flow

The current job application workflow follows this structure:

Applicant
    │
    ▼
Job Opportunities
    │
    ▼
View Job Details
    │
    ▼
Apply Now
    │
    ▼
Application Form
    │
    ├── Personal Information
    ├── Contact Information
    ├── Cover Letter
    ├── Resume
    └── Terms & Conditions
    │
    ▼
Laravel API
    │
    ▼
Application Processing
    │
    ▼
Admin / QMS System
Development Status
Completed
Production website interface
Responsive website layout
Dynamic job posting integration
Job listing API integration
Job details modal
Job description display
Application modal interface
Application form frontend
Job-to-application relationship
Inquiry API integration
Loading states
Empty states
Error handling
Responsive navigation
Interactive UI components
Motion animations
Lucide icon integration
Upcoming Development

The next development phase will focus on the Complaint Form API Integration.

Planned work includes:

Connecting the complaint form to the Laravel API
Submitting complaint data to the backend
Uploading evidence images
Sending latitude and longitude
Testing backend validation responses
Handling successful submissions
Handling API validation errors
Testing complaint records inside the administrative/QMS system
Production Build

The project uses Vite for production builds.

Install dependencies:

npm install

Run the development server:

npm run dev

Create a production build:

npm run build

Preview the production build locally:

npm run preview

The production files are generated inside:

dist/
Environment & API Configuration

The frontend communicates with the production Laravel API through HTTPS endpoints.

API configuration should be maintained separately from UI components whenever possible.

For production deployments, ensure that:

API endpoints are accessible through HTTPS
CORS configuration allows the production frontend domain
Backend validation is enabled
File upload limits are properly configured
API responses return valid JSON
Production environment variables are configured correctly

Sensitive credentials, private API keys, and server configuration files should never be committed to the repository.

Git Workflow

The project uses Git for source control and GitHub for repository management.

Typical workflow:

git status
git add .
git commit -m "your commit message"
git push origin main

For production changes, commits should describe the actual feature, fix, or maintenance work performed.

Example:

feat: integrate dynamic job postings and application workflow
Production Deployment

The website is deployed as a production frontend application.

Before deploying a new version, verify the following:

Production build completes successfully
No JavaScript console errors
API endpoints are reachable
Job postings load correctly
Job details open correctly
Application modal works correctly
Application submission works correctly
Forms display validation errors properly
Mobile layout works correctly
Images and assets load correctly
Navigation links work correctly

Production build verification:

npm run build

A successful build should generate the dist/ directory without compilation errors.

Security Considerations

The frontend should never be treated as the primary security layer.

All important validation and authorization must be enforced by the backend API.

The Laravel backend is responsible for:

Request validation
File validation
Data sanitization
Authentication and authorization where required
Database integrity
Application processing
Secure file handling

The frontend provides user experience and client-side validation, while the backend remains the authoritative validation layer.

Maintenance

When maintaining the website:

Pull the latest repository changes.
Install dependencies when necessary.
Test API connectivity.
Run the development server.
Verify affected frontend components.
Run the production build.
Review the browser console for errors.
Commit changes using a descriptive commit message.
Push changes to the repository.
Deploy the verified production build.
Current Development Milestone

Current milestone: Job Opportunities & Application Integration

The frontend is currently connected to the backend for dynamic job opportunities and job application processing.

The next milestone is:

Complaint Form API Integration

Job Posting API
      ✓
      │
      ▼
Job Details
      ✓
      │
      ▼
Application Form
      ✓
      │
      ▼
Application API
      ✓
      │
      ▼
Complaint Form API
      ← NEXT DEVELOPMENT PHASE
Project Purpose

The Job Connections website is intended to provide a reliable digital recruitment platform that simplifies the process of connecting Filipino applicants with international employment opportunities.

The system combines a modern public-facing recruitment website with a backend administrative and QMS environment, allowing recruitment data and applicant submissions to be managed centrally.

License

This project is proprietary software developed for The Job Connections.

Unauthorized copying, redistribution, modification, or commercial use of the source code is prohibited unless explicitly authorized by the project owner.