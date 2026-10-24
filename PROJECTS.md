# Projects Overview

## Campus Recovery Desk

A React + TypeScript + Vite lost-and-found application for managing recovered items, claims, and staff access.

### 📋 Project Description

Campus Recovery Desk is a web-based system designed to streamline the management of lost and found items on a campus. The application provides staff members with tools to:
- Track recovered items
- Manage user claims for lost items
- Verify claim authenticity
- Maintain staff profiles
- Access protected resources via secure authentication

### ✨ Key Features

- **Item Management** - Browse, search, and view detailed information about recovered items
- **Claims Processing** - Review and manage claims submitted by users for lost items
- **Authentication** - Secure login system with protected routes for staff-only access
- **Responsive Design** - Clean, modern UI built with Tailwind CSS
- **TypeScript Support** - Fully typed codebase with zero TypeScript errors
- **Parameterized Routing** - Dynamic item detail pages using React Router

### 🏗️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| React | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| React Router | Client-side routing |
| Zustand | State management for auth |
| Tailwind CSS | Styling |
| JSON Server | Mock backend (db.json) |

### 📁 Project Structure

```
src/
├── App.tsx                  # Route configuration
├── main.tsx                 # Application entry point
├── index.css                # Global styles with Tailwind
├── api/
│   └── client.ts            # API client configuration
├── components/
│   ├── Layout.tsx           # Shared navigation and layout
│   ├── ProtectedRoute.tsx   # Auth guard component
│   ├── StatusBadge.tsx      # Status display component
│   ├── ComplaintCard.tsx    # Item card component
│   ├── Usercard.tsx         # User display component
│   └── ui/                  # Reusable UI components
├── hooks/
│   ├── usePrevious.ts       # Track previous values
│   └── useToggle.ts         # Toggle state hook
├── lib/
│   └── utils.ts             # Utility functions
├── pages/
│   ├── HomePage.tsx         # Dashboard landing
│   ├── ItemsPage.tsx        # Items list
│   ├── ItemDetailPage.tsx   # Item details
│   ├── ClaimsPage.tsx       # Claims management
│   ├── LoginPage.tsx        # Authentication
│   ├── ProfilePage.tsx      # Staff profile (protected)
│   ├── ProjectsPage.tsx     # Projects view
│   ├── DashboardPage.tsx    # Dashboard
│   ├── ReportsPage.tsx      # Reports
│   └── NotFoundPage.tsx     # 404 fallback
├── schemas/
│   └── claimSchema.ts       # Data validation schemas
├── store/
│   ├── authStore.ts         # Zustand auth state
│   └── uiStore.ts           # Zustand UI state
└── types/
    ├── api.ts               # API type definitions
    └── index.ts             # Type exports
```

### 🛣️ Application Routes

| Route | Page | Access | Description |
|-------|------|--------|-------------|
| `/` | HomePage | Public | Dashboard landing page |
| `/items` | ItemsPage | Public | Browse all recovered items |
| `/items/:itemId` | ItemDetailPage | Public | View specific item details |
| `/claims` | ClaimsPage | Public | Review claims and queue |
| `/login` | LoginPage | Public | Staff authentication |
| `/profile` | ProfilePage | Protected | Authenticated staff profile |
| `/projects` | ProjectsPage | Public | Projects overview |
| `/dashboard` | DashboardPage | Public | Dashboard view |
| `/reports` | ReportsPage | Public | Reports and analytics |
| `*` | NotFoundPage | Public | 404 page for unknown routes |

### 🔐 Authentication

- **State Management**: Zustand auth store (`authStore.ts`)
- **Protected Routes**: `ProtectedRoute.tsx` component guards access
- **Redirect**: Unauthenticated users redirected to `/login`
- **Persistent Login**: Token-based authentication flow

### 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Start Mock Backend**
   ```bash
   npm run start:api
   ```

The application will be available at the Vite local development URL (typically `http://localhost:5173`).

### 📝 Mock Data

Sample data is stored in `db.json` and includes:
- **Items**: Lost items with id, name, category, status, and location
- **Claims**: User claims with claimant info and status tracking

### 🌿 Git Workflow

- **Branch**: `gt3-part1`
- **Status**: Active development
- **Build Status**: ✅ Verified with zero TypeScript errors

### 📄 Licensing

This project is created for coursework and is not intended for public commercial distribution.
