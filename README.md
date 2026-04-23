# Invoice Management App

A fully responsive full-stack **Invoice Management Application** built with **React** that allows users to create, manage, track, and filter invoices with support for drafts, payment updates, theme switching, and persistent storage.

##  Overview

This project was built as part of **Frontend Wizards — Stage 2 Task** and implements a complete invoice workflow with strong focus on:

- CRUD functionality
- Form validation
- Invoice status management
- Filtering
- Light/Dark theme support
- Responsiveness
- Accessibility
- Persistent data storage

## Features

### Invoice Management (CRUD)
- Create new invoices
- View all invoices
- View invoice details
- Edit existing invoices
- Delete invoices with confirmation modal

### Invoice Workflow
- Save invoices as **Draft**
- Create **Pending** invoices
- Mark pending invoices as **Paid**
- Visual invoice status badges
- Prevent invalid status transitions

### Form Validation
Includes validation for:
- Required fields
- Valid email addresses
- At least one invoice item
- Positive quantity and price values
- Error states and validation messages

### Filtering
Filter invoices by:
- All
- Draft
- Pending
- Paid

Includes empty-state handling when no invoices match filters.

### Theme Toggle
- Light mode
- Dark mode
- Theme preference persistence using LocalStorage

### Responsive Design
Optimized for:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

### Interactive UI
Includes hover states for:
- Buttons
- Inputs
- Links
- Filters
- Invoice cards

---

## Tech Stack

### Frontend
- React/TypeScript
- React Hooks
- Context API (Theme / State Management)
- CSS / Styled Components / Tailwind 


### Data Persistence
Supports persistence using:
- LocalStorage

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/thepromzzy/invoice-management-app.git
cd invoice-management-app
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Core Functionality

### Create Invoice
Users can:
- Open invoice form
- Fill in client details
- Add invoice items
- Save as draft or submit invoice

### Read Invoice
Users can:
- View invoice list
- Click any invoice to see full details

### Update Invoice
Users can:
- Edit invoice details
- Save updates persistently

### Delete Invoice
Users can:
- Delete invoice only after confirmation modal

---

## Invoice Status Logic

| Status  | Allowed Actions |
|--------|----------------|
| Draft  | Edit, Delete, Send |
| Pending | Edit, Delete, Mark as Paid |
| Paid | View only |

Rules:
- Drafts can be edited later
- Pending invoices can be marked paid
- Paid invoices cannot revert back

---

## Theme Support
Global light/dark theme implementation includes:

- Persistent theme selection
- Accessible color contrast
- Full component adaptation

Theme stored using:

```javascript
localStorage
```

---

## Accessibility
This project follows accessibility best practices:

- Semantic HTML
- Proper labels for form inputs
- Keyboard navigable UI
- Focus-trapped modals
- ESC key closes modal
- Accessible buttons and controls
- WCAG-compliant contrast ratios

---

## 🧠 Architecture Decisions

### State Management
Context API was used to manage:
- Invoices
- Filters
- Theme state

### Persistence Trade-Off
Used **LocalStorage** for simplicity and fast setup.

Trade-offs:
- Simple persistence
- No authentication required
- Not ideal for multi-user syncing

Potential upgrade:
- Move to backend API + database

---

##  Improvements Beyond Requirements
Possible future improvements:

- Authentication
- PDF invoice export
- Email invoice sending
- Search functionality
- Invoice analytics dashboard
- Backend integration with database
- Drag and drop invoice items
- Unit/integration testing

---

##  Acceptance Criteria Covered
- [x] Full CRUD functionality
- [x] Form validation
- [x] Draft and payment flow
- [x] Invoice filtering
- [x] Theme persistence
- [x] Fully responsive UI
- [x] Accessible components
- [x] Clean component architecture
- [x] No console errors

---

## Live Demo

```bash

```

---

## GitHub Repository

```bash
https://github.com/thepromzzy/invoice-management-app
```

---

## Author
Built by **Promise Jacob**
