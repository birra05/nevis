# Lean Implementation Plan

**Spec:** [spec.md](./spec.md)  
**Stack:** React 18, TypeScript, Vite, Express, Recharts, Tailwind CSS, lucide-react, Vitest, pnpm

## Project Structure

```text
server/
├── index.ts        # Express API
└── data.json       # static book-of-business data

src/
├── types.ts
├── components/
│   ├── Chart/
│   │   ├── Chart.tsx
│   │   ├── ChartSkeleton.tsx
│   │   └── index.tsx
│   ├── ErrorState/
│   │   ├── ErrorState.tsx
│   │   └── index.tsx
│   └── TreegridTable/
│       ├── TreegridTable.tsx
│       ├── TreegridSkeleton.tsx
│       └── index.tsx
└── App.tsx

Tests are colocated with the components and helpers they cover.
```

## Development Steps

1. **Express API** — create `GET /api/business-overview` in `server/index.ts`. Serve a static, valid `data.json` response and delay it by 300 ms to exercise the loading state.

2. **Types and helpers** — define abstract `TreeNode` and `DashboardData` in `src/types.ts`. Add pure helpers to find nodes, flatten visible rows, and map `timeSlots` plus direct-child values into Recharts data. Keep all values **As-Is**: never recalculate parent totals.

3. **Treegrid Table** — build the hierarchy as a `<table>` with `role="treegrid"`, `aria-expanded`, and `aria-level`. Support `Enter`, `Space`, and arrow-key navigation. The arrow expands/collapses only its branch; the row name changes only chart focus.

4. **Recharts Chart** — add `ResponsiveContainer` and `BarChart`. For a selected non-leaf, stack only its direct children by time slot; for a leaf, show its own values.

5. **Styles, responsiveness, and tests** — use Tailwind and lucide-react, verify a 375px viewport, and add loading/error/retry states. Add stable, descriptive `data-testid` attributes to key stateful or dynamic UI targets, then use them in Vitest where semantic role/name queries are not sufficient. Write Vitest tests for expand/collapse, independent chart focus, and As-Is chart-data mapping.
