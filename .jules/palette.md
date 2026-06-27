# Palette's Journal - UX & Accessibility Learnings

## 2025-05-14 - Tooltips for Icon-only Buttons
**Learning:** Icon-only buttons, while space-efficient, can be ambiguous for users who rely on visual cues but don't immediately recognize the icon. Providing a Tooltip alongside an ARIA label ensures both visual and screen-reader accessibility. In HeroUI v3, the `Tooltip` component should wrap the interactive element, using `Tooltip.Trigger` and `Tooltip.Content` for clarity.
**Action:** Always wrap icon-only buttons in a Tooltip if the action isn't globally standard or if additional clarity can be provided without cluttering the UI.
