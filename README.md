# Project Management System - Frontend Client

This is the React + Vite frontend client for the Project Management System. It features a modern dashboard, responsive design, real-time collaboration updates, and role-based access control (RBAC).

---

## 🛠️ Tech Stack & Dependencies

- **Core Framework:** React 18 & Vite (for lighting fast development and optimized builds)
- **State Management:** Redux Toolkit & React Redux (global application state, including authentication, projects, and notifications)
- **Styling:** Tailwind CSS & PostCSS (responsive, theme-compliant CSS design)
- **Navigation:** React Router DOM (v6) (featuring role-restricted and token-protected routing)
- **API Client:** Axios (configured with automated JWT request interception)
- **Real-Time Communication:** Socket.io-client (instantly notifies users about status updates and administrative changes)
- **UI Elements & Assets:** Lucide React (vector-based iconography)
- **User Feedback:** React Hot Toast (success/error notification alerts)

---

## ✨ Key Features & UX Details

### 1. Unified Dashboard & Analytics (Admin-Only)
- Dynamic KPIs displaying total projects, status breakdowns (Pending, In Progress, Completed), and critical deadlines.
- Automatically scoped so that admins only see statistics for projects **they created**.

### 2. Premium User Assignment UI (`MultiUserSelect`)
- Replaces standard select list fields with a robust search-enabled dropdown.
- Users can check or uncheck assignees from a list that filters instantly as they type.
- Selected members are displayed as tag chips featuring quick removal `x` buttons.

### 3. Role-Based Access Routing
- **Public Routes:** Login (`/login`).
- **Protected Routes:** Requires verification of user token (`localStorage`).
- **Admin-Only Routes:** Dashboard, User Management, Activity Logs, and Project Creation.
- **Dynamic Redirects:** Automatically routes logged-in users to their optimal workspace (Admins to dashboard, Standard Users to project board).

### 4. Interactive Project Feeds & Status Updates
- Detailed overview pages showing project description, deadlines, attachments, and collaborators.
- In-place status updates with progress notes.
- Instant feedback through toast alerts.

### 5. Resilient Form Submissions
- Form fields in pages like User Management do not wipe out inputs on API validations errors, persisting inputs until a successful API response is verified.

---

## 📁 Folder Structure

```text
project-Managment-frontend/
├── src/
│   ├── app/            # Redux store configuration
│   ├── components/     # UI Components
│   │   ├── common/     # Reusable UI controls (e.g., MultiUserSelect, loaders, buttons)
│   │   └── layout/     # Structural shells (e.g., Sidebar, AppShell, Navbar)
│   ├── features/       # Redux state slices (auth, projects, users, activities, etc.)
│   ├── hooks/          # Custom hooks (e.g., useSocket, useAppHooks)
│   ├── pages/          # Complete page views (Dashboard, Auth, Projects, Profile, etc.)
│   ├── routes/         # Route wrappers (ProtectedRoute, RoleRoute)
│   ├── services/       # API layer configurations (Axios clients and hooks)
│   └── styles/         # Global styles and Tailwind configuration sheets
├── index.html          # HTML entry point
├── package.json        # NPM dependencies and run scripts
├── tailwind.config.js  # Tailwind CSS parameters
└── vite.config.js      # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the backend API running. By default, the frontend points to `http://localhost:5000/api`.

### Installation & Run

1. **Navigate to the frontend directory:**
   ```bash
   cd project-Managment-frontend
   ```

2. **Configure Environment Variables:**
   A `.env` configuration file exists under `src/.env` to define the API endpoint. You can modify it or create a `.env` in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   The local client will start up at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```
   This compiles and optimizes your React app inside the `dist/` directory.

6. **Preview Production Build Locally:**
   ```bash
   npm run preview
   ```
