# GitHub Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static GitHub Page in `docs/` that showcases the contact form
project and links to its documentation without embedding the live form.

**Architecture:** The page will be a standalone browser-only static site under
`docs/`, using `index.html`, `styles.css`, and `main.js`. It will reuse the
reference page's structure and visual language while adding light/dark theme
support, project-focused cards, test explanations, and documentation links.

**Tech Stack:** HTML, CSS, vanilla JavaScript, existing static assets
`docs/header_banner.png` and `docs/favicon.ico`.

## File Structure

- Create `docs/index.html` for the public GitHub Page content.
- Create `docs/styles.css` for page layout, theme variables, responsive cards,
  buttons, and accessibility states.
- Create `docs/main.js` for theme persistence, JSON-LD injection, and small
  progressive enhancement behavior.
- Modify no root app files, so the actual contact form remains separate.

## Tasks

### Task 1: Baseline Verification

- [ ] Run `npm run test` from the project root.
- [ ] Record whether the current validation and integration suite is passing
  before page changes.

### Task 2: Static Page Skeleton

- [ ] Create `docs/index.html` with semantic sections:
  hero, overview, features, architecture, tests, documentation, run locally,
  and footer.
- [ ] Link `./styles.css`, `./main.js`, `./favicon.ico`, and
  `./header_banner.png`.
- [ ] Add SEO metadata, Open Graph metadata, Twitter metadata, canonical URL,
  skip link, and accessible theme toggle.

### Task 3: Styling And Themes

- [ ] Create `docs/styles.css` using the reference site's dark palette,
  card layout, hero banner treatment, and responsive spacing.
- [ ] Add light theme variables through `[data-theme="light"]`.
- [ ] Ensure all interactive elements have visible focus states.
- [ ] Keep the page readable on mobile widths.

### Task 4: JavaScript Enhancements

- [ ] Create `docs/main.js` with theme detection from `localStorage` and
  `prefers-color-scheme`.
- [ ] Persist theme choices under a project-specific storage key.
- [ ] Inject JSON-LD for `SoftwareSourceCode` and `WebPage`.
- [ ] Add the `js` class after DOM load for progressive enhancement hooks.

### Task 5: Final Verification

- [ ] Run `npm run test`.
- [ ] Run a static server and inspect the GitHub Page in a browser.
- [ ] Check lints for edited files.
- [ ] Summarize changed files and any verification limitations.
