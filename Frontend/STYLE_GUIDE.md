Style Guide - Frontend

Purpose

- Provide conventions for CSS Modules, utility styles, and when to use inline styles.

CSS Modules

- Filename: Use ComponentName.module.css colocated with the component.
- Import: import styles from './ComponentName.module.css'
- Class usage: Use className={styles.className}
- Naming: use camelCase for class names in CSS Modules (e.g., profileContainer, postItem)
- Scope: Keep component-scoped rules (layout, colors, spacing) inside module files.

Shared utilities

- Create shared utilities for commonly used tokens (variables.css) and small helpers (Utils.module.css):
  - page wrappers, centered containers, text-muted, spacing helpers.
- Prefer composition: components use utility classes + module classes for component-specific styles.

Button component contract

- Button accepts props: variant (primary|secondary|ghost), size (sm|md|lg), disabled, className
- Button should expose semantic classNames for variants. Prefer external className for layout.
- Examples:
  - <Button variant="primary" size="md">Save</Button>
  - <Button className={styles.fullWidth}>Continue</Button>

When to keep inline styles

- Small, single dynamic values only (e.g., --progress CSS variable, dynamic opacity). Prefer CSS variables set via inline style when necessary:
  - <div style={{ '--progress': `${progress}%` }} />
- Avoid big style objects. Convert static styles to CSS Modules.

Accessibility

- Keep focus states, color contrast in modules.
- Use rem/em for scalable typography where appropriate.

Migration notes

- When converting inline styles:
  1. Move static values to the component module.
  2. For dynamic single-value styles, prefer CSS variables and set via inline style.
  3. Run lint and build after changes.

Conventions

- Keep components focused: presentational CSS in module; logic in JS/JSX.
- Do not export non-component values from files with React components (hot reload rule). Move hooks to src/shared/hooks.

Contact

- For questions about conventions, open an issue on the repo with the tag `style-guidelines`.
