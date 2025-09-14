# Discussion

## Future work: derive and share types from Drizzle schema
- Prefer deriving types from the Drizzle schema using `InferSelectModel` / `InferInsertModel` instead of maintaining a separate shared types file.
- If starting from an existing DB, use `drizzle-kit` introspection to generate the TS schema, then infer types from it.
- For runtime validation and cross-boundary sharing, consider `drizzle-zod` to generate Zod schemas from the Drizzle schema and use `z.infer` in the client.

Example (schema-derived types):
```ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { advocates } from "@/db/schema";

export type Advocate = InferSelectModel<typeof advocates>;
export type NewAdvocate = InferInsertModel<typeof advocates>;
```
