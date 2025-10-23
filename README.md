# VLU KTX Management System - High-Fidelity Prototype

This project is a high-fidelity, interactive front-end prototype for the Van Lang University (VLU) Dormitory (KTX) Management System. It is built using pure HTML, CSS, and JavaScript, as specified in the "Expert Specification Report".

The primary goal of this prototype is to simulate the dynamic user experience for two key roles—**Students** and the **Administrative Board (BQL)**—without a live backend. It achieves state persistence across pages by leveraging the browser's `localStorage`.

## Features

This prototype simulates the following core user workflows (UAs):

### Student Portal (`student/`)
- **Dashboard**: Central hub displaying room info, contract status, financial debt, and latest request status.
- **UA1: Dormitory Registration**: A multi-step process to find, select, apply for, and track a room registration.
- **UA2: Fee Payment**: View a list of invoices, see overdue alerts, and simulate payment through a mock payment gateway.
- **UA3: Room Transfer Request**: A form to request a room change, with prerequisite checks for outstanding fees.
- **UA4: Check-Out Request**: A form to request termination of the stay, with prerequisite checks for outstanding fees.
- **Incident Reporting**: A simple form to report issues like broken equipment.

### Administrative Portal (`admin/`)
- **Dashboard**: An operational cockpit showing key metrics like pending applications, transfer requests, and available room slots.
- **UA1: System Configuration**: Interface to control system-wide variables (e.g., utility prices) with a logged history of all changes.
- **UA2: Reporting**: A simulated interface to generate and download various reports (e.g., financial, occupancy).
- **UA3: Registration Approval**: A queue to review, verify, and approve or reject new student registrations.
- **UA4: Financial Management**: A centralized view of all student invoices, allowing for filtering and manual payment confirmation.
- **UA5: Transfer Processing**: A queue to review, verify, and approve or reject student room transfer requests.
- **UA6: Check-Out Processing**: A workflow to confirm a student has met all financial and physical obligations before finalizing their departure.

## Technical Implementation

- **Stack**: HTML5, CSS3, Vanilla JavaScript (ES6). No frameworks or libraries are used.
- **State Management**: The entire application state (student data, admin data, room lists, etc.) is managed in a single JavaScript object. This state is persisted in the browser's `localStorage` via a `js/state_manager.js` script. This allows for a realistic simulation of a multi-page application where actions on one page have consequences on another.
- **Session Simulation**: A student's "login" is simulated by storing their unique ID in `sessionStorage`. This allows the application to display data relevant only to that specific student.
- **Styling**: The UI is styled with pure CSS, leveraging variables for a consistent theme (VLU's brand colors). Layouts are built using modern CSS features like Flexbox and Grid.
- **File Structure**: The project is organized by user roles (`/student`, `/admin`) with shared assets in `/css` and `/js` directories.

## How to Run the Prototype

1.  **No server needed**: Since this is a static prototype, you can simply open the `index.html` file in any modern web browser.
2.  **Login**: On the `index.html` page, choose a role ("Student" or "Admin") from the dropdown and click "Login".
3.  **Interact**: Navigate through the sidebar links to explore the different workflows for each role.
4.  **Test State Persistence**:
    - As a student, pay an invoice on the "Thanh toán phí" page.
    - Navigate to the "Yêu cầu trả phòng" page. The form, which may have been disabled due to outstanding fees, should now be enabled.
    - As an admin, approve a student's registration. Observe the "Hồ sơ chờ duyệt" count decrease on the admin dashboard.
5.  **Reset State**: To reset all data to its initial default state, click the "Reset Website State" button on the login page (`index.html`).

## File Structure Overview

```
.
├── admin/
│   ├── configuration.html
│   ├── checkout_process.html
│   ├── dashboard.html
│   ├── handle_transfer.html
│   ├── payment_confirm.html  (Not implemented, placeholder)
│   ├── reports.html
│   └── review_registrations.html
├── css/
│   └── styles.css
├── js/
│   ├── admin.js
│   ├── checkout_process.js
│   ├── checkout_request.js
│   ├── configuration.js
│   ├── fees.js
│   ├── handle_transfer.js
│   ├── incident_report.js
│   ├── main.js
│   ├── payment_confirm.js  (Not implemented, placeholder)
│   ├── register.js
│   ├── reports.js
│   ├── review_registrations.js
│   ├── state_manager.js
│   ├── student.js
│   └── transfer_request.js
├── student/
│   ├── checkout_request.html
│   ├── dashboard.html
│   ├── fees.html
│   ├── incident_report.html
│   ├── register.html
│   └── transfer_request.html
├── index.html
└── README.md
```