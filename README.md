# The Job Connections

> Production recruitment website for The Job Connections, providing overseas employment opportunities and an online application platform for job seekers.

## Overview

**The Job Connections** is a modern recruitment website designed to showcase available overseas employment opportunities and provide applicants with a convenient way to submit job applications online.

The website is built as a lightweight frontend application using **Vite, Vanilla JavaScript, and Tailwind CSS**. It communicates with a Laravel-based backend API to retrieve published job opportunities and submit applications.

The platform is designed to provide a responsive, accessible, and user-friendly experience across desktop, tablet, and mobile devices.

---

## Features

### Job Opportunities

- Dynamically retrieves published job postings from the backend API
- Displays available positions without hardcoded job data
- Displays job title, country, posting date, and other available information
- Supports backend pagination
- Automatically retrieves all available job pages
- Provides loading, empty, and error states

### Job Details

- Interactive job details modal
- Retrieves complete job information from the backend
- Displays the full job description
- Supports formatted job descriptions
- Responsive modal interface
- Animated modal transitions

### Online Job Application

- Application form connected to the backend API
- Applicants can submit their personal information
- Job-specific application support
- Resume/file upload
- Cover letter submission
- Terms and conditions validation
- Frontend validation and error handling
- Backend validation response handling
- Loading state during submission
- Success and error feedback

### Assistance / Complaint Form

The website includes an assistance/complaint form designed to allow users to submit concerns and supporting information.

Current frontend functionality includes:

- Complaint information form
- Character counter
- Image evidence upload
- Maximum of three evidence images
- File type validation
- File size validation
- Browser geolocation support
- Latitude and longitude capture
- Reverse geocoding for address detection
- Loading and submission states
- Validation and error handling

> **Note:** The frontend complaint form is prepared for API integration. The production complaint API endpoint is pending backend implementation/deployment.

### User Interface

- Responsive design
- Mobile-friendly navigation
- Interactive modals
- Smooth animations
- Lucide icons
- Form validation feedback
- Dynamic content rendering
- Accessible interface elements
- Responsive layouts for different screen sizes

---

## Technology Stack

### Frontend

- **HTML5**
- **CSS3**
- **Vanilla JavaScript (ES Modules)**
- **Tailwind CSS**
- **Vite**

### Libraries

- **Motion** — UI and modal animations
- **Lucide** — Interface icons
- **SweetAlert2** — User notifications and alerts
- **EmailJS** — Contact form email integration

### Backend

- **Laravel**
- **REST API**
- **PHP**
- **Database-backed job posting and application system**

### Development Tools

- **Visual Studio Code**
- **Git**
- **GitHub**
- **npm**

---

## Project Structure

```text
jobconnections/
│
├── public/
│   ├── images/
│   └── assets/
│
├── src/
│   ├── js/
│   │   ├── animation.js
│   │   ├── application.js
│   │   ├── assistance.js
│   │   ├── branches.js
│   │   ├── contact.js
│   │   ├── counter.js
│   │   ├── jobs.js
│   │   ├── navbar.js
│   │   ├── scroll.js
│   │   └── slider.js
│   │
│   ├── components/
│   │   ├── navbar.html
│   │   ├── home.html
│   │   ├── about.html
│   │   ├── branches.html
│   │   ├── services.html
│   │   ├── contact.html
│   │   ├── request-modal.html
│   │   └── footer.html
│   │
│   ├── main.js
│   └── input.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md