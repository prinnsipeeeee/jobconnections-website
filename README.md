# The Job Connections

A professional recruitment and employment platform designed to connect qualified Filipino workers with overseas job opportunities and recruitment services.

The website provides a modern, responsive, and user-friendly interface where applicants can explore available job opportunities, view job details, submit inquiries, and access recruitment-related services.

The frontend communicates with a Laravel-based backend API for dynamic content such as job postings and application-related data.

---

## Overview

**The Job Connections** is a production-deployed recruitment website developed to provide a digital platform for overseas employment opportunities.

The system is designed to support recruitment operations by providing:

- Overseas job opportunity listings
- Dynamic job postings retrieved from the backend API
- Individual job details
- Online job application workflow
- Recruitment service information
- Applicant inquiry submission
- Complaint submission
- Responsive design for desktop, tablet, and mobile devices
- Interactive modals and user-friendly forms
- Location-based functionality for complaint submissions

The frontend is built with a lightweight and maintainable architecture using Vite, Vanilla JavaScript, HTML, and Tailwind CSS.

---

## Key Features

### Job Opportunities

Job opportunities are dynamically retrieved from the backend API instead of being hardcoded into the website.

Applicants can:

- Browse available job openings
- View job title
- View destination country
- View posting date
- Open detailed job information
- Proceed to the application process

Job availability is managed through the backend administration system.

### Job Details

Each job posting has a dedicated details view that retrieves complete information from the backend.

The job details include:

- Job title
- Country
- Posting date
- Job description
- Application action

The frontend retrieves the complete job information using the job's UUID.

### Job Application

The application interface is designed to allow applicants to apply directly for a selected job opportunity.

Application data includes:

- First name
- Last name
- Middle name
- Contact number
- Email address
- Cover letter
- Resume
- Terms and conditions acceptance
- Selected job reference

The selected job UUID is used as the `job_id` when communicating with the backend API.

### Inquiry Form

Applicants and visitors can submit inquiries through the website.

The inquiry form communicates with the backend API and allows recruitment-related concerns and questions to be submitted to the organization.

### Complaint Form

The website includes a complaint submission system for applicants and overseas Filipino workers.

The complaint form supports:

- OFW information
- Foreign recruitment agency
- Contact information
- Address abroad
- Complaint details
- Location coordinates
- Evidence uploads

The complaint data is submitted to the backend and managed through the administrative system.

### Location Detection

The complaint form supports browser-based geolocation.

Users can select **Use My Location** to automatically retrieve their current coordinates.

The frontend also uses reverse geocoding to convert coordinates into a readable address.

### Responsive Design

The website is designed to provide a consistent experience across:

- Desktop
- Laptop
- Tablet
- Mobile devices

The interface uses responsive layouts and adaptive components throughout the website.

### Interactive UI

The website includes interactive components such as:

- Modal dialogs
- Animated sections
- Job detail modals
- Form interactions
- Mobile navigation
- Loading states
- Empty states
- Error states
- Interactive buttons
- Lucide icons

Animations are implemented using Motion.

---

## Technology Stack

### Frontend

- HTML5
- Vanilla JavaScript
- Tailwind CSS
- Vite
- Motion
- Lucide Icons

### Backend

The frontend communicates with a Laravel-based backend API.

Backend technologies include:

- Laravel
- PHP
- REST API
- MySQL
- Filament Admin Panel
- Laravel API Resources
- Laravel Form Requests
- Spatie Media Library

### Development Tools

- Visual Studio Code
- Git
- GitHub
- NPM
- Vite Development Server

---

## Project Structure

```text
thejobconnections/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── src/
│   ├── components/
│   ├── js/
│   │   ├── jobs.js
│   │   ├── inquiry.js
│   │   ├── complaint.js
│   │   └── ...
│   │
│   ├── styles/
│   └── main.js
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md