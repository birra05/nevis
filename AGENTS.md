# Project conventions

## Plugins and skills

- Do not use complex plugins or skills unless the user explicitly invokes them with `$`.

## Module boundaries

- A directory exposes its public API only through its `index.ts` file. Consumers outside that directory must import from the directory entry point (or its explicit `index.ts`), never from its internal files.

## TypeScript and React formatting

- Define functions with `const functionName = () =>`; do not use function declarations.
- Define React components with `const ComponentName = () =>`.
- Type React components with `FC<Props>`; use `FC` for components without props.
- Run `pnpm format` after edits. Prettier controls mechanical formatting; do not fight it.
- Preserve and add semantic blank lines. Do not compress multiple statements, callbacks, or JSX elements into one line simply because they fit.
- In React components, keep declarations in this order, separating each group with one blank line:
  1. State, refs, and context.
  2. Effects and non-handler hooks (including data-fetching and subscriptions).
  3. Event handlers and callbacks (including `useCallback` handlers).
  4. Derived values.
  5. Early returns.
  6. Main JSX return.
- Prefer braced `if` statements and multiline JSX returns for readable control flow.
- Use only existing semantic CSS theme tokens for color. Do not introduce or guess new colors without an explicit design source; in TSX use `var(--color-...)` rather than duplicated color literals.
- Do not place inline callbacks with logic in JSX props (including callback refs). Define a named handler or callback in the component's handler section and pass it by reference instead.

## Function complexity

- Consider the time and space complexity of every new or modified function.
- Prefer clear, declarative code using standard array and string methods for ordinary UI-sized data.
- Do not replace a readable declarative transformation with manual loops, flags, counters, or early exits solely to reduce temporary allocations.
- Optimize for time or memory only when profiling, expected data volume, or a performance-sensitive path justifies the added complexity.
- Prefer O(n) time or better when it does not materially reduce clarity.
- Do not introduce nested collection traversals with O(n²) complexity unless the trade-off is explicitly justified.
- Use `Map` or `Set` for repeated lookups when they meaningfully reduce complexity.
- Prefer readable code when an optimization offers no practical benefit for the expected data size; document the trade-off when it is non-obvious.
- In code reviews, state the time and space complexity of non-trivial changed functions.

## Testing

- Run `pnpm test`, `pnpm lint`, and `pnpm format:check` as relevant verification without asking for separate user approval.
- Add stable, descriptive `data-testid` attributes to key interactive controls and dynamic UI states that need targeted assertions.
- Prefer user-facing semantic queries by role and accessible name when they identify the target reliably; use `data-testid` for stateful or dynamic targets where they do not.
- Do not add test IDs to every DOM element. Keep them scoped to meaningful test boundaries and behavior.

## Fixture data

- Treat `server/data.json` as immutable fixture data.
- Do not add, remove, rename, reorder, or change fields or values in `server/data.json` unless the user explicitly requests a fixture-data change.
- Do not add UI-only data to the fixture. Keep presentation fallbacks and UI state outside it.

## Change approval workflow

- For structural changes to the architecture, document the decision before implementing.
- For local refactorings and bug fixes, proceed directly to code and verification.
