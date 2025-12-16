## 2025-07-16 - Handling Easter Eggs and Motion
**Learning:** Easter eggs like Konami codes often introduce unexpected motion (rotation, floating). Users with `prefers-reduced-motion` settings can be negatively affected even by hidden features.
**Action:** When implementing fun animations, always wrap motion-heavy logic in a `window.matchMedia('(prefers-reduced-motion: reduce)')` check. For these users, provide a "static" alternative (e.g., just changing colors) or skip the effect entirely to ensure inclusivity without sacrificing delight.
