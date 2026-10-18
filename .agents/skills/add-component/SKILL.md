---
name: add-component
description: Scaffolds a new accessible React 19 UI component with Tailwind CSS styling and Vitest component tests. Use whenever the user asks to create, build, or implement a React UI component.
category: coding
tags: [typescript, react, tailwind, ui, a11y, vitest, cur8d]
---

# Add React Component to cur8d/typescript

This skill guides you through scaffolding a new reusable, accessible UI component in `app/components/` with Tailwind CSS styling and React Testing Library tests.

## Prerequisites

- Node.js 22+ and `pnpm` installed
- `@testing-library/react` and `vitest` installed

## Workflow

### 1. Component Design & Location
Create a dedicated component directory under `app/components/<ComponentName>/`:
- `app/components/<ComponentName>/index.tsx` (Component implementation)
- `tests/unit/components/<ComponentName>.test.tsx` (Component test suite)

### 2. Implement the Component
Follow React 19 / Tailwind best practices:
- Keep the component as a Server Component by default; add `"use client"` directive only if using state, event listeners, or client-only hooks.
- Adhere to accessibility (WCAG 2.1 AA):
  - Semantic HTML (`<button>`, `<nav>`, `<article>`, `<section>`).
  - Visible keyboard focus states (`focus-visible:ring-2 focus-visible:outline-none`).
  - Proper ARIA labels (`aria-label`, `aria-expanded`) where icons or non-text elements are used.

```typescript
import React from 'react';

export interface CardProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {actionText && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
```

### 3. Implement Component Test
In `tests/unit/components/<ComponentName>.test.tsx`:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '@/app/components/Card';

describe('Card Component', () => {
  it('renders title and description', () => {
    render(<Card title="Test Title" description="Test Description" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('triggers onAction when action button is clicked', () => {
    const handleAction = vi.fn();
    render(<Card title="Action Card" actionText="Click Me" onAction={handleAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
```

### 4. Verify Quality Gates
Run repository verification:

```bash
mise run verify
```

## Boundaries

✅ **Always do:**
- Always ensure components support keyboard navigation and visible focus rings.
- Always include automated unit tests using `@testing-library/react`.
- Always verify all checks pass with `mise run verify`.

🚫 **Never do:**
- Never mark components as `"use client"` unnecessarily.
- Never use non-semantic elements (like `<div onClick=...>`) for interactive controls.
