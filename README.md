# Book of Business Dashboard

An accessible dashboard for exploring a hierarchical book of business over time. It combines a stacked bar chart with an expandable treegrid table, allowing a user to focus the chart on any node in the hierarchy.

## Stack

React 19, TypeScript, Vite, Node.js with Express, Recharts, Tailwind CSS, lucide-react, Vitest, and pnpm.

## Run locally

Install dependencies first:

```bash
pnpm install
```

Start the API and Vite client in separate terminals:

```bash
pnpm dev
```

```bash
pnpm dev:client
```

The API runs at `http://localhost:3001`, and the client runs at `http://localhost:5173`. Vite proxies `/api` requests to the API server.

## Commands

```bash
pnpm test          # Run the Vitest suite
pnpm lint          # Run ESLint
pnpm typecheck     # Type-check server and client code
pnpm build         # Type-check and build the production client
pnpm format        # Format files with Prettier
pnpm format:check  # Check formatting without writing files
```

## What is implemented

- `GET /api/business-overview`, backed by the immutable `server/data.json` fixture and normalised into a recursive `children` hierarchy.
- A loading state, an error state, and a retry action for API and data-validation failures.
- A stacked chart that shows direct children of the selected node, or the selected leaf's own trend.
- A treegrid with dynamic time-slot columns, independent chart-focus and expand/collapse controls, and keyboard navigation.
- Accessible treegrid semantics: visible rows expose their level, expandable rows expose their expanded state, and the controls work with native `Enter` and `Space` activation.
- A responsive layout: the table can scroll horizontally within its own container on narrow screens without overflowing the page.
- A Nevis favicon loaded from the supplied CDN asset.

## Data assumptions

- The API response supplies ordered, dynamic `timeSlots` and a recursive node hierarchy.
- Every node's `values` array must have the same length as `timeSlots`; otherwise the dashboard shows an error state.
- Values are displayed exactly as supplied. Parent values are never recalculated from child totals.
- Values have no specified unit, so they are presented as whole numbers rather than inferred currency or percentages.

## Tests

The Vitest suite covers treegrid expansion and selection behaviour, keyboard collapse, loading and error states, and chart data mapping for direct children, leaves, dynamic time slots, and supplied values.

## Scope

Filtering, sorting, pagination, export, persistence, authentication, and live updates are intentionally out of scope.

See the [specification](docs/spec.md) and [implementation plan](docs/plan.md) for the original requirements and implementation outline.
