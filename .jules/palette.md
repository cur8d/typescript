# Palette's Journal - UX & Accessibility Learnings

## 2025-05-14 - Tooltips for Icon-only Buttons
**Learning:** Icon-only buttons, while space-efficient, can be ambiguous for users who rely on visual cues but don't immediately recognize the icon. Providing a Tooltip alongside an ARIA label ensures both visual and screen-reader accessibility. In HeroUI v3, the `Tooltip` component should wrap the interactive element, using `Tooltip.Trigger` and `Tooltip.Content` for clarity.
**Action:** Always wrap icon-only buttons in a Tooltip if the action isn't globally standard or if additional clarity can be provided without cluttering the UI.

## 2025-05-15 - Explicit Target and Rel Attributes for External Links
**Learning:** External links should always open in a new tab/window using `target="_blank"` and `rel="noopener noreferrer"` to keep users within the application's context and prevent reverse tab-nabbing vulnerabilities. Providing a visual helper (e.g. `ExternalLink` icon) and a screen reader helper text (e.g. `(opens in a new window)`) dramatically improves both UX expectations and screen reader accessibility.
**Action:** Always apply `target="_blank"`, `rel="noopener noreferrer"`, visual cues, and screen reader announcements to external URLs.

## 2025-05-15 - Micro-UX Polish: Focus and Snappiness
**Learning:** High-contrast focus rings (`focus-visible:ring-primary`) significantly improve navigation for keyboard-only users. Additionally, reducing Tooltip delay from 300ms to 200ms makes the interface feel noticeably more responsive and "snappy" without becoming distracting.
**Action:** Apply consistent `focus-visible` styles to all interactive elements and standardize Tooltip delays to 200ms across the application.
