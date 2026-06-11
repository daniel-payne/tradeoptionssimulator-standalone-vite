---
name: react-router-v7
description: React Router v7 best practices, including nested routing, SPA client data loading (clientLoader/clientAction), hook usage, and type-safe routing.
---

# React Router v7 Best Practices

This skill guides the implementation of React Router v7 (formerly Remix) within SPA and local-first applications.

## 1. Core Principles

- **Nested Routing:** Use nested routes and layout files with `<Outlet />` to manage complex page hierarchies and state isolation.
- **SPA client-side loaders/actions:** In local-first client-only apps (like Vite SPAs), prefer `clientLoader` and `clientAction` over standard `loader` and `action` to bypass server requirements.
- **Type-safe Navigation & Hooks:** Use React Router 7 typed parameters and standard hooks like `useNavigate()`, `useParams()`, and `useLoaderData()`.

## 2. clientLoader & clientAction (Local-First/SPA Mode)

In a Vite-based local-first SPA, data fetch/persistence happens directly in the browser (e.g. IndexedDB). Use `clientLoader` to load local database records before rendering the route.

### Example SPA Route Module

```tsx
import type { Route } from "./+types/my-route"
import { useLoaderData, Link } from "react-router"
import { db } from "@/data/indexDB/db"

// clientLoader runs entirely in the browser
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const marketId = params.id
  const market = await db.markets.get(marketId)
  if (!market) {
    throw new Response("Market not found", { status: 404 })
  }
  return { market }
}

export default function MarketDetail() {
  // Types are inferred from the loader automatically
  const { market } = useLoaderData<typeof clientLoader>()

  return (
    <div className="p-6 card bg-base-200">
      <h2 className="card-title text-primary">{market.name}</h2>
      <p>Base Currency: {market.baseCurrency}</p>
      <Link to="/prices" className="btn btn-secondary mt-4">Back to Prices</Link>
    </div>
  )
}
```

## 3. Route Configuration & Navigation

### Lazy Loading Routes
Configure routes in `src/routes.ts` or dynamically in Vite. For performance, keep bundle sizes small by utilizing lazy components.

### Common Hooks Usage

- **useNavigate:** Programmatic redirects.
  ```typescript
  const navigate = useNavigate();
  // Redirect to prices
  navigate("/prices");
  ```
- **useParams:** Extract dynamic route params.
  ```typescript
  const { symbol } = useParams<{ symbol: string }>();
  ```
- **useLocation:** Access location state, query parameters, or hash.
  ```typescript
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get("filter");
  ```

## 4. UI Patterns with DaisyUI & Tailwind CSS

- Ensure layout routes provide structure (e.g., sidebars, headers) and wrap the main section in `<Outlet />`.
- Maintain scroll states and loading/pending transitions using navigation states.
  ```tsx
  import { useNavigation } from "react-router"
  
  const navigation = useNavigation()
  const isPending = navigation.state === "loading"
  ```
