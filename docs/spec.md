# Lean Specification: Book of Business Dashboard

**Status:** Ready for planning · **Source:** [reference design](https://www.figma.com/design/t6itC2qsmr3WLPugwrVdqS/Web-engineer-home-task?node-id=1-2781&t=kXYnDW6zY9In2k5A-0)

## Sources and precedence

- [Original task](./original-task.md) defines the product scope and functional and non-functional requirements.
- This specification records implementation decisions and clarifies choices left open in the original task.
- The [reference design](https://www.figma.com/design/t6itC2qsmr3WLPugwrVdqS/Web-engineer-home-task?node-id=1-2781&t=kXYnDW6zY9In2k5A-0) is the visual and interaction reference.
- If sources conflict, this specification takes precedence; otherwise, follow the original task.

## Goal & Scope

Accessible exploration of time-series values in an arbitrary hierarchy: React + TypeScript client, Node.js `GET /api/business-overview`, Stacked Bar Chart, and expandable Treegrid Table. Match the reference design unless it conflicts with this spec.

Out of scope: authentication, editing, persistence, filters, sorting, pagination, export, live updates, and prescribed domain-specific levels or names.

## Data Contract

```ts
type TreeNode = { id: string; name: string; values: number[]; children?: TreeNode[] };
type DashboardData = { timeSlots: string[]; root: TreeNode };
```

- `timeSlots` is dynamic, ordered, and supplies all table-column and chart labels; each `values` array aligns by index.
- A node may be a leaf at any depth; names and hierarchy shape are unrestricted.
- `server/data.json` is supplied read-only fixture data and must remain unchanged.
- **As-Is:** show API values exactly as provided. Never calculate, correct, reconcile, or replace parent values from child totals.
- A malformed payload or unequal `values.length` / `timeSlots.length` is an error state; no partial or misleading data is rendered.

## Behavior

- Chart focus is a node. A non-leaf chart stacks its direct children for every time slot; a leaf shows its own trend.
- Activating a row **name** changes only chart focus and provides a route back to an ancestor.
- The table shows the visible tree and all time-slot values. Activating its arrow (`>`) expands/collapses only that branch; it never changes chart focus. Name activation never changes expansion. Leaves have no arrow.

## Requirements & Acceptance

- Fetch `/api/business-overview`; show loading while pending, or a clear error and retry for request/validation failures.
- Expose `role="treegrid"`; visible rows provide `aria-level`, expandable rows provide correct `aria-expanded`.
- `Enter`/`Space` activate the targeted name or arrow; arrow keys navigate visible treegrid rows and controls predictably.
- From 375px upward, all content and controls remain reachable without page-level horizontal overflow or clipping.
- Key UI states and controls under test expose stable, descriptive `data-testid` attributes. Vitest uses those hooks for stateful or dynamic UI where an accessible role and name would not identify the target reliably.
- Vitest covers loading/error/retry, dynamic time-slot and As-Is mapping, chart-name focus, independent arrow expansion, and keyboard behavior.
- With arbitrary valid data, bars/columns follow `timeSlots`; direct children alone form a non-leaf stack; inconsistent supplied totals remain unchanged; the name and arrow actions stay independent.

## Assumptions

Values are one neutral numeric measure (no inferred currency/unit). Series labels and colors derive from the focused node's direct children.
