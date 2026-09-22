# 🏛️ Stackly Municipal Services - Civic e-Governance Platform

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://lingalamanasa.github.io/Muncipal-services/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/lingalamanasa/Muncipal-services)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Production-success.svg)]()

> A modern, responsive, full-featured Municipal e-Governance and Civic Administration web application built for seamless citizen engagement and municipal administration.

---

## 🔗 Quick Links & GitHub Formats

| Resource | Link | Description |
| :--- | :--- | :--- |
| **🌐 Live GitHub Pages Site** | [https://lingalamanasa.github.io/Muncipal-services/](https://lingalamanasa.github.io/Muncipal-services/) | Deployed interactive web application |
| **📁 GitHub Repository** | [https://github.com/lingalamanasa/Muncipal-services](https://github.com/lingalamanasa/Muncipal-services) | Source code, assets, and version control |
| **📥 Clone Link (HTTPS)** | `https://github.com/lingalamanasa/Muncipal-services.git` | Git clone URL for local development |
| **📥 Clone Link (SSH)** | `git@github.com:lingalamanasa/Muncipal-services.git` | SSH Git clone URL |

---

## ✨ Key Portals & Features

### 1. 👥 Citizen Services Portal
- **Overview Dashboard ([`citizen-dashboard.html`](citizen-dashboard.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-dashboard.html)):** Integrated summary of active grievances, property records, NOC requests, and tax status.
- **Citizen Grievance Hub ([`citizen-grievances.html`](citizen-grievances.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-grievances.html)):** Track civic complaints in real-time with resolution SLAs and audit logs.
- **24/7 Helpdesk & Support Station ([`citizen-helpdesk.html`](citizen-helpdesk.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-helpdesk.html)):** Live chat routing, toll-free helplines, inquiry velocity charts, and ticket logs.
- **Property Taxes & Utilities ([`citizen-taxes.html`](citizen-taxes.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-taxes.html)):** Municipal assessment records, tax ledger breakdown, auto-debit management, and receipt downloads.
- **DigiLocker Digital Vault ([`citizen-vault.html`](citizen-vault.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-vault.html)):** Verified digital document certificates (Birth Certificate, Municipal Khata, Water & Sewerage NOC).
- **Ward Voting & Civic Consultation ([`citizen-voting.html`](citizen-voting.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-voting.html)):** Direct democracy civic budget polls and ward ballots.
- **Municipal Services Directory ([`citizen-services.html`](citizen-services.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/citizen-services.html)):** Comprehensive catalog of city services and applications.

### 2. 🛡️ Municipal Staff Command Center
- **Staff Operations Command ([`staff-dashboard.html`](staff-dashboard.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/staff-dashboard.html)):** Fleet status, live emergency dispatch, SCADA IoT telemetry, and department queues.
- **Field Fleet Dispatch & Logistics ([`staff-dispatch.html`](staff-dispatch.html) & [`staff-fleet.html`](staff-fleet.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/staff-dispatch.html)):** Rapid civic emergency dispatch, vehicle tracking, and field crew routing.
- **SCADA & Municipal IoT Telemetry ([`staff-scada.html`](staff-scada.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/staff-scada.html)):** Water grid, power distribution, traffic sensors, and sanitation monitors.
- **Civic Broadcast & Public Advisories ([`staff-broadcasts.html`](staff-broadcasts.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/staff-broadcasts.html)):** City-wide alert dispatch.
- **Resolution SLA Monitoring ([`staff-sla.html`](staff-sla.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/staff-sla.html)):** Ward-level response analytics and team performance metrics.

### 3. 🌐 Public Civic Portal & Exploration
- **Homepage ([`index.html`](index.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/index.html)):** Hero carousels, quick services grid, civic news, and departmental overviews.
- **About Municipal Corporation ([`about.html`](about.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/about.html)):** Heritage timeline (1888–2026), civic leadership, and city charter.
- **City Projects & Infrastructure ([`projects.html`](projects.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/projects.html)):** Live public infrastructure tracking, budget allocations, and contractor milestones.
- **Civic Departments ([`departments.html`](departments.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/departments.html)):** Detailed directories for civil engineering, public health, water, fire, and revenue.
- **Civic News & Press ([`blog.html`](blog.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/blog.html)):** Municipal publications, budget releases, and environmental updates.
- **Emergency Helpline & Contact ([`contact.html`](contact.html) • [Live Demo](https://lingalamanasa.github.io/Muncipal-services/contact.html)):** Direct emergency contact directory, hotline dispatch, and location map.
- **User Authentication ([`login.html`](login.html) & [`signup.html`](signup.html)):** Secure citizen and staff sign-in flows.
- **Smart 404 Recovery ([`404error.html`](404error.html) & [`404.html`](404.html)):** Universal session history tracking with an intelligent "Go Back" system.

---

## 🛠️ Technology Stack

- **Markup & Layout:** HTML5 Semantic Architecture
- **Styling:** Vanilla CSS3 with Custom Design Tokens & Mobile-First Responsive Breakpoints
- **Visuals & Icons:** FontAwesome 6.5, Custom Vector Badges, Optimized Modern WebP Media
- **Animations & Effects:** GSAP (GreenSock Animation Platform) 3.12, ScrollTrigger
- **Interactive Visualizations:** Chart.js Data HUDs (Velocity Line Charts, Channel Distribution Bar Charts, Subject Classification Doughnuts)
- **Deployment:** GitHub Pages (Static Site via `.nojekyll`)

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lingalamanasa/Muncipal-services.git
   cd Muncipal-services
   ```

2. **Launch with any local HTTP server:**
   - Using Python:
     ```bash
     python -m http.server 8000
     ```
   - Using Node / npx:
     ```bash
     npx serve .
     ```
   - Or open `index.html` directly in any modern browser.

3. **Open in browser:**
   Navigate to `http://localhost:8000` to browse the full municipal portal.

---

## 📄 License & Attribution

Developed for **Stackly Municipal Corporation**. All rights reserved &copy; 2026.
