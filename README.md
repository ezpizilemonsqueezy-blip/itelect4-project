# Campus Recovery Desk

A React + TypeScript + Vite lost-and-found application for managing recovered items, claims, and staff access. This version demonstrates the GT3 routing and auth pattern using a domain-specific app instead of reusing the class demo.

## Overview

This app lets staff:

- browse recovered items
- search for a specific item
- view item detail pages via a parameterized route like `/items/:itemId`
- review claim activity
- log in and access protected profile content
- navigate through a shared layout with a navbar and outlet

## Core Features

- React Router for page navigation and parameterized routes
- Zustand auth store with `token`, `login`, and `logout`
- Protected route guard that redirects unauthenticated users to `/login`
- Shared `Layout` component with a nav and `Outlet`
- Lost-and-found domain pages for Home, Items, Claims, and Profile
- Fallback `*` route for unknown URLs
- No TypeScript errors in the production build

## Project Structure

- `src/App.tsx` — route table for the application
- `src/components/Layout.tsx` — shared navigation and layout shell
- `src/components/ProtectedRoute.tsx` — auth guard for protected pages
- `src/store/authStore.ts` — Zustand auth state with typed interface
- `src/pages/` — page-level screens for the lost-and-found app
- `src/main.tsx` — app entry point with `BrowserRouter`
- `src/index.css` — base styling and Tailwind setup

## Main Routes

- `/` — home/dashboard landing page
- `/items` — list of recovered items
- `/items/:itemId` — item detail page
- `/claims` — claim verification and queue view
- `/login` — login page
- `/profile` — protected staff profile page
- `*` — not found page

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the Vite local URL in the browser.

## Git / Workflow Notes

This project is developed on the branch:

- `gt3-part1`

The branch was pushed to the remote for the pull request workflow. No tag was created for this stage.

## Build Verification

The project was verified with:

```bash
npm run build
```

This completed successfully with zero TypeScript errors.

## Licensing

This project is created for coursework and is not intended for public commercial distribution.

