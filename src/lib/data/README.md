# Data Layer & Mocking

This directory contains the data access layer for the application. It is designed to work with mock data initially and can be easily swapped with real Supabase calls.

## Using Mock Data

Mock data is defined in `src/lib/data/mock.ts`. The data access functions in `src/lib/data/index.ts` use these mocks.

```typescript
import { getKpis, getTableData } from '@/lib/data';

const kpis = await getKpis();
const tableData = await getTableData();
```

## Integration with Supabase

To transition from mock data to real Supabase data, follow these steps:

1.  **Define Table Types:** Update the interfaces in `mock.ts` or create a new `types.ts` that matches your Supabase schema.
2.  **Update Data Access Functions:** Modify `src/lib/data/index.ts` to use the Supabase client.

Example:
```typescript
import { createClient } from '@/lib/supabase/server';

export async function getKpis() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('kpis').select('*');
  if (error) throw error;
  return data;
}
```

## Supabase Utilities

- `src/lib/supabase/client.ts`: Supabase client for Client Components.
- `src/lib/supabase/server.ts`: Supabase client for Server Components (Actions, Middlewares, Route Handlers).
- `src/lib/supabase/middleware.ts`: Session refresh logic used by the root `middleware.ts`.
