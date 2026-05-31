# Jira Mini Project

React + Vite + TypeScript mini shop app used to practice service layers, async
UI states, state management, and refactoring into a production-style frontend
structure.

## Setup

From the `frontend` folder, install dependencies:

```bash
npm install
```

Create a local env file from `.env.example`, then set the backend URL:

```bash
cp .env.example .env
```

Start the Express API from the `frontend` folder:

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
npm run dev        # Start frontend
npm run server     # Start Express API on the configured backend port
npm run typecheck  # Run TypeScript without emitting files
npm run build      # Typecheck and production build
npx eslint src     # Lint app source files
```

## Structure

```txt
Jira_mini_project/
  backend/
    server.ts    TypeScript Express API entry point
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

- API setup is separated into `api/axiosInstance.ts`, `api/paths.ts`, and
  `api/requestConfig.ts`.
- Business API calls live in `services/`, such as `product.service.ts` and
  `auth.service.ts`.
- Service request options use the shared `RequestOptions` type, so Axios
  `signal` handling is not rewritten in each service file.
- Global state uses Zustand because the app needs cart/auth state across
  unrelated components without prop drilling.
- Cart state is persisted with Zustand `persist`, so cart items survive page
  refresh.
- Components access store data through selectors such as `selectCartCount` and
  `selectCartItems`.
- Async product views use loading, error, empty, and data states.
- Reusable async reads use `useFetch<T>`. Reusable async writes/actions use
  `useAsyncAction`.
- Route pages are wrapped with `ErrorBoundary` so rendering errors are shown
  with a fallback UI instead of breaking the whole app.
- Constants are kept in `configs/`, while small reusable helpers are kept in
  `utils/`.
- Frontend source files use TypeScript (`.ts`) and TSX (`.tsx`) for React
  components.

## API Cleanup In Effects

API calls started inside `useEffect` use the reusable `useFetch<T>` hook.
`useFetch<T>` owns `AbortController` cleanup and exposes `data`, `status`,
`error`, `refetch`, and `abort`.

Applied hooks:

- `src/hooks/useProductList.ts`
- `src/hooks/useProductDetail.ts`
- `src/hooks/useProductOptions.ts`

How it works:

1. Domain hooks call `useFetch<T>(queryKey, fetcher)`.
2. `useFetch<T>` aborts the previous request before starting a new one.
3. `useFetch<T>` creates a new `AbortController` for each API load.
4. The fetcher receives `controller.signal`.
5. The service passes that `signal` to Axios.
6. The `useEffect` cleanup calls `controller.abort()`.
7. Canceled requests are ignored with `isRequestCanceled()`.

This prevents unnecessary network work when a component unmounts or an effect
dependency changes before the request completes.

The domain hooks stay small. They only map generic fetch state into UI-specific
data, such as converting an empty product list into the `empty` status.

`useFetch<T>` also supports `enabled: false` for cases where a request should
not run yet, such as an invalid or missing product id.

Service methods that support cancellation:

- `productService.getProducts(params, { signal })`
- `productService.getProductById(id, { signal })`
- `productMetaService.getCategories({ signal })`
- `productMetaService.getTags({ signal })`

`React.StrictMode` is enabled in `src/main.tsx`. In development, React may run
the effect lifecycle like this:

```txt
mount -> effect -> cleanup -> effect
```

The cleanup is intentional. It helps reveal duplicate API calls, missing cleanup,
duplicated subscriptions, and unsafe side effects. Production builds are not
double-invoked by Strict Mode.

## Reusable Frontend Patterns

- Use `services/` for API calls. Components and pages should not call Axios
  directly.
- Use `useFetch<T>` for data loaded by route/page effects.
- Use `useAsyncAction` for submit/delete style actions that need loading and
  error state.
- Use `api/requestConfig.ts` when a service needs query params or an
  `AbortSignal`.
- Use `utils/` helpers such as `formatVndPrice` when display formatting appears
  in more than one component.
- Keep page components focused on workflow and navigation. Move repeated API,
  async state, formatting, and store logic into hooks, services, stores, or
  utilities.
