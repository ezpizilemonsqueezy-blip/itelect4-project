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
- `/login` — sign-in form (calls `POST /api/auth/login`)
- `/register` — account creation (calls `POST /api/auth/register`, then signs in)
- `/items` — your recovered items (protected)
- `/items/add` — log an item; the category dropdown reads `GET /api/categories` (protected)
- `/items/:itemId` — item detail page (protected)
- `/claims` — claim submission and approve/reject queue (protected)
- `/profile` and `/review` — profile and AI project review (protected)
- `*` — not found page

## Backend

All data comes from [itelect4-backend](https://github.com/ezpizilemonsqueezy-blip/itelect4-backend) (Express + MongoDB Atlas). Every call goes through the single `request()` helper in `src/api/client.ts`, which prefixes `VITE_API_URL` and adds the `Authorization: Bearer <token>` header to private calls. The types in that file mirror the backend's JSON responses.

## Design

The UI is a "lost property office": items are manila luggage tags, statuses are rubber stamps, and the home page radar shows every real item as a blip that pings when the sweep passes it. Animations only use `transform` and `opacity` (GPU-composited, 60fps), page changes use the View Transitions API (a tag grows into its detail page), and everything is switched off under `prefers-reduced-motion`. The Items page has a "flashlight" search mode. Styles live in `src/index.css`; motion helpers in `src/lib/motion.ts`.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend URL (defaults to `http://localhost:4000`).
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the Vite local URL in the browser. The backend's `CORS_ORIGIN` must include this origin.

## Deployment

Deployed on Vercel with `VITE_API_URL` set to the deployed backend URL. `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh. The frontend's Vercel address is listed in the backend's `CORS_ORIGIN`.

## Git / Workflow Notes

GT4 work is on the `gt4-part2` branch, merged through a pull request and tagged `gt4`.

## Build Verification

The project was verified with:

```bash
npm run build
```

This completed successfully with zero TypeScript errors.

## Licensing

This project is created for coursework and is not intended for public commercial distribution.

