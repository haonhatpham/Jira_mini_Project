# Jira Mini Project

React + Vite mini shop app used to practice service layers, async UI states,
state management, and refactoring into a production-style frontend structure.

## Setup

From the `frontend` folder, install dependencies:

```bash
npm install
```

Start the JSON Server API from the `frontend` folder:

```bash
npm run server
```

This command starts the Express backend in `../backend`.

Start the Vite app in another terminal:

```bash
npm run dev
```

Open the app at:

```txt
http://localhost:5173
```

Demo login:

```txt
username: admin
password: 123
```

## Scripts

```bash
npm run dev      # Start frontend
npm run server   # Start JSON Server on port 3001
npm run build    # Production build
npx eslint src   # Lint app source files
```

## Structure

```txt
Jira_mini_project/
  backend/
    db.json       JSON Server mock database
  frontend/
    src/
      api/        Axios instance and API paths
      assets/     Static assets
      components/ Reusable UI components
      configs/    Shared constants and configuration
      hooks/      Custom hooks for async page data
      pages/      Route-level screens
      services/   Domain API services
      stores/     Zustand global state stores
      types/      Shared TypeScript types
      utils/      Reusable helper functions
```

## Decisions

- API setup is separated into `api/axiosInstance.ts` and `api/paths.ts`.
- Business API calls live in `services/`, such as `product.service.ts` and
  `auth.service.ts`.
- Global state uses Zustand because the app needs cart/auth state across
  unrelated components without prop drilling.
- Cart state is persisted with Zustand `persist`, so cart items survive page
  refresh.
- Components access store data through selectors such as `selectCartCount` and
  `selectCartItems`.
- Async product views use loading, error, empty, and data states.
- Route pages are wrapped with `ErrorBoundary` so rendering errors are shown
  with a fallback UI instead of breaking the whole app.
- Constants are kept in `configs/`, while small reusable helpers are kept in
  `utils/`.
