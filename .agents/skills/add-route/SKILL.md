---
name: add-route
description: Scaffolds a new Next.js App Router API route or page with Zod validation, error handling, and Vitest tests. Use whenever the user asks to create, scaffold, or implement an API endpoint or page route.
category: coding
tags: [typescript, nextjs, react, api, zod, cur8d]
---

# Add App Router Route to cur8d/typescript

This skill guides you through scaffolding a new API route handler (`route.ts`) or page (`page.tsx`) in Next.js 15+ App Router adhering to cur8d standards.

## Prerequisites

- Node.js 22+ and `pnpm` installed
- `zod` for request validation

## Workflow

### 1. API Route Handler (`app/api/<route>/route.ts`)
When adding an API route:
1. Create the endpoint directory: `app/api/<route_name>/route.ts`.
2. Define input validation schemas with Zod:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { z } from 'zod';

   const RequestSchema = z.object({
     title: z.string().min(1),
     description: z.string().optional(),
   });

   export async function POST(req: NextRequest) {
     try {
       const body = await req.json();
       const parsed = RequestSchema.safeParse(body);

       if (!parsed.success) {
         return NextResponse.json(
           { error: 'Validation failed', details: parsed.error.format() },
           { status: 400 }
         );
       }

       // Implement business logic
       return NextResponse.json({ success: true, data: parsed.data }, { status: 201 });
     } catch {
       return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
     }
   }
   ```

3. Create companion test under `tests/unit/api/<route_name>.test.ts`:
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { NextRequest } from 'next/server';
   import { POST } from '@/app/api/<route_name>/route';

   describe('POST /api/<route_name>', () => {
     it('returns 201 for valid input', async () => {
       const req = new NextRequest('http://localhost:3000/api/<route_name>', {
         method: 'POST',
         body: JSON.stringify({ title: 'Test Item' }),
       });
       const res = await POST(req);
       expect(res.status).toBe(201);
     });
   });
   ```

### 2. Page Route (`app/<page_name>/page.tsx`)
When adding a page route:
1. Create `app/<page_name>/page.tsx`.
2. Use React Server Components by default.
3. Export page metadata:
   ```typescript
   import type { Metadata } from 'next';

   export const metadata: Metadata = {
     title: 'Page Title',
     description: 'Page description',
   };

   export default function Page() {
     return (
       <main className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-bold">Page Title</h1>
       </main>
     );
   }
   ```

### 3. Verification
Verify linting, type checks, and tests:

```bash
mise run verify
```

## Boundaries

✅ **Always do:**
- Always validate client inputs with Zod schemas.
- Always return consistent JSON error objects with appropriate HTTP status codes.
- Always include unit tests in `tests/unit/api/`.

🚫 **Never do:**
- Never mark an entire page or route as `"use client"` unless interactive React hooks (`useState`, `useEffect`) are strictly necessary.
- Never expose sensitive error stack traces in production JSON responses.
