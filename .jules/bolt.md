## 2025-05-15 - [CLS and Static Optimization]
**Learning:** Preventing Cumulative Layout Shift (CLS) in hydration-sensitive components (like theme toggles) can be achieved by explicitly mirroring the framework's (HeroUI) internal dimensions in the component's CSS. Additionally, moving static metadata like JSON-LD outside the render loop and pre-stringifying it avoids redundant computations on every server-side render.
**Action:** Always check the library's base CSS for default dimensions of "icon-only" buttons and apply them to placeholders. Pre-compute static data that doesn't depend on props or state outside the component scope.

## 2025-05-20 - [Avoid Dynamic Computation in Rendering]
**Learning:** Hoisting values that are dynamic but stable over the application's lifecycle (e.g., `new Date().getFullYear()`) to the module scope avoids unnecessary re-computation on every component render. This is particularly beneficial for components used globally, like footers.
**Action:** Move stable dynamic values out of component functions and compute them once at the module level.
