# Discussion

## Derive and share types from Drizzle schema
- Prefer deriving types from the Drizzle schema using `InferSelectModel` / `InferInsertModel` instead of maintaining a separate shared types file. This keeps the types authoritative and in sync with the actual DB.
- If starting from an existing DB, use `drizzle-kit` introspection to generate the TS schema, then infer types from it.
- For runtime validation and cross-boundary sharing, consider `drizzle-zod` to generate Zod schemas from the Drizzle schema and use `z.infer` in the client.

Example (schema-derived types):
```ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { advocates } from "@/db/schema";

export type Advocate = InferSelectModel<typeof advocates>;
export type NewAdvocate = InferInsertModel<typeof advocates>;
```

## Virtualize long tables for large datasets
- Once results grow beyond a few hundred rows, render cost (DOM nodes + layout) becomes a bottleneck. Use windowing to render only visible rows.
- Tools: `react-window` or `react-virtualized`.
- Strategy: Keep server pagination as the primary control. Within a page (e.g., 100–200 rows), virtualize to reduce DOM.

Example (very simplified):
```tsx
import { FixedSizeList as List } from "react-window";

const Row = ({ index, style }) => (
  <div style={style}>/* render row cells */</div>
);

<List height={600} width={"100%"} itemSize={48} itemCount={rows.length}>
  {Row}
</List>
```

## Full‑text search and fuzzy matching in Postgres
- Current search uses `ILIKE` across fields. For scalable relevance-based search, consider Postgres full-text search (FTS) with `to_tsvector` and a GIN index.
- For fuzzy matching (typos), add `pg_trgm` extension and GIN indexes with `gin_trgm_ops` for selected fields.

Example (conceptual):
```sql
-- FTS
ALTER TABLE advocates
  ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(first_name,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(last_name,'')),  'A') ||
    setweight(to_tsvector('simple', coalesce(city,'')),       'B') ||
    setweight(to_tsvector('simple', coalesce(degree,'')),     'B')
  ) STORED;
CREATE INDEX IF NOT EXISTS advocates_search_tsv_idx ON advocates USING gin (search_tsv);

-- Query
SELECT * FROM advocates
WHERE search_tsv @@ plainto_tsquery('simple', $1)
ORDER BY ts_rank(search_tsv, plainto_tsquery('simple', $1)) DESC
LIMIT $limit OFFSET $offset;

-- Trigram fuzzy (optional)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS advocates_name_trgm_idx
  ON advocates USING gin (last_name gin_trgm_ops);
```

API considerations:
- Accept `q`, `mode=fts|fuzzy|ilike`, and return scores when applicable.
- Guard with feature flags; fall back to `ILIKE` if extensions are unavailable.

## Keyset (cursor) pagination for stability
- Offset pagination is fine initially, but it degrades with deep pages and can yield duplicates if rows change between requests.
- Use keyset pagination on a stable sort (e.g., `(last_name, id)`), returning a cursor token. This is O(1) page traversal and robust to inserts/deletes.

API shape:
```json
GET /api/advocates?limit=25&cursor=eyJsYXN0TmFtZSI6IkRvZSIsImlkIjozM30=
{
  "data": [/* rows */],
  "nextCursor": "eyJsYXN0TmFtZSI6IkNsYXJrIiwiaWQiOjEwMH0="
}
```

Implementation notes:
- Encode/decode a small JSON payload `{ lastName, id }` as base64.
- For previous pages, maintain a stack client-side or implement bidirectional cursors (more complex).

## Testing: E2E and contract tests
- Add Playwright tests that cover: search term persistence in URL, sorting toggles, pagination boundaries, empty-state, and details modal open/close.
- Add API contract tests (e.g., Vitest + supertest) for `/api/advocates` covering params validation and sort/dir behavior.

Playwright outline:
```ts
test('search + url sync + pagination', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Search').fill('john');
  await expect(page).toHaveURL(/q=john/);
  await page.getByText('Next').click();
  await expect(page).toHaveURL(/page=2/);
});
```

## Accessibility checklist
- Table semantics: header `scope="col"`, sufficient contrast, focus-visible on interactive rows, semantic buttons/labels.
- Keyboard: Tab/Shift+Tab traversal, Enter/Space to open row details, Escape to close modal, focus trap inside modal.
- ARIA: `role="dialog"` and `aria-modal="true"` for modal; associate labels with inputs.
- Reduced motion: respect `prefers-reduced-motion` for spinners/animations.

Minimal modal focus trap (conceptual):
```tsx
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}, [onClose]);
```

