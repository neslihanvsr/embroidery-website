# RULES.md

# HoyThreads Development Rules

These rules apply to every task in this project.

---

# 1. Project Understanding

Before making any changes:

1. Always read:
   - PROJECT.md
   - RULES.md
   - STATUS.md (if available)
   - README.md (when relevant)

2. Follow the approved project plan documented in PROJECT.md.

3. Use STATUS.md as the source of truth for current project progress.

---

# 2. Development Principles

- Make the smallest possible change needed.
- Keep code modular, organized, and maintainable.
- Extend existing code instead of rewriting it.
- Do not redesign completed work unless requested.
- Preserve the approved design system.
- Keep the project easy to migrate to Flask.
- Keep the project compatible with GitHub Pages.

---

# 3. Existing Code Rules

Before creating new code:

- Search the project first.
- Reuse existing components whenever possible.
- Never duplicate HTML structures.
- Never duplicate CSS selectors.
- Never duplicate JavaScript functions.
- Extend existing implementations instead of creating new ones.
- Modify only the necessary files.

---

# 4. CSS Organization

Follow the existing CSS architecture.

## base.css

Contains only:

- CSS variables
- Reset / Normalize
- Typography
- Global utility classes

## layout.css

Contains:

- Header
- Footer
- Containers
- Grid
- Sections
- Layout
- Responsive layout

## components.css

Contains reusable UI components:

- Buttons
- Cards
- Navigation
- Forms
- Tags
- Chips
- Modals
- Accordions

Rules:

- Never place layout styles in components.css.
- Never duplicate selectors.
- Extend existing selectors whenever possible.

---

# 5. HTML Rules

- Use semantic HTML5.
- Maintain accessibility.
- Preserve heading hierarchy.
- Use descriptive alt text.
- Keep page structure consistent.
- Do not duplicate shared components unnecessarily.

---

# 6. JavaScript Rules

- Keep JavaScript modular.
- Reuse existing functions.
- Avoid global variables.
- Keep DOM manipulation organized.
- Prefer reusable helper functions.

---

# 7. Responsive Design

Every change must work on:

- Mobile
- Tablet
- Desktop

Do not break existing responsiveness.

---

# 8. Accessibility & SEO

Always consider:

- Semantic HTML
- Keyboard accessibility
- ARIA when appropriate
- Proper heading order
- Image alt text
- Meta information
- Performance

---

# 9. File Modification Rules

Before modifying a file:

- Read the file completely.
- Understand the current implementation.
- Preserve formatting.
- Preserve naming conventions.
- Do not rename files without approval.
- Do not change the folder structure.

---

# 10. AI Workflow

For every task:

1. Explain the approach before making changes.
2. Modify only the required files.
3. Keep changes as small as possible.
4. Summarize:
   - Files changed
   - What was added
   - Important decisions
5. Wait for approval before continuing.

---

# 11. Restrictions

Do not:

- Rewrite completed pages.
- Replace existing components.
- Introduce new libraries without approval.
- Modify PROJECT.md unless requested.
- Modify STATUS.md unless the task requires updating project progress.
- Make unrelated changes while implementing a feature.

---

# 12. Git Workflow

After each approved milestone:

1. Review the changes.
2. Test the project.
3. Commit with a clear commit message.
4. Push to GitHub.
5. Continue with the next approved task.

Never commit broken code.
