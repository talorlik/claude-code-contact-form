# AGENTS.md

## How to Investigate

Read the highest-value sources first:

- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config

If architecture is still unclear after reading these resources, inspect a small
number of representative code files to find the real entrypoints, package boundaries,
and execution flow. Prefer reading the files that explain how the system is wired
together over random leaf files. Prefer executable sources of truth over prose.
If docs conflict with config or scripts, trust the executable source and only keep
what you can verify.

## What to Extract

Look for the highest-signal facts for an agent working in this repo:

- exact developer commands, especially non-obvious ones
  - Commands for running a single test:
    `npm run test:integration -- --filter "validateFullName rejects empty"`
  - Command for linting and typechecking: `npm run lint && npm run typecheck`
- how to run a single test, a single package, or a focused verification step
  - Run a single Jest file: `npx vitest run tests/unit/validation.test.js`
  - Run a single Playwright test:
    `npx playwright test tests/e2e/contact-form.spec.js -g "submits successfully"`
- required command order when it matters
  - Lint, typecheck, then test: `npm run lint && npm run typecheck && npm run test`

## Conventions & Workflow

### Architecture

The project has a strict separation between **pure** modules (e.g., `javascript/validation.js`)
and **DOM** modules (e.g., `javascript/countryPicker.js`).

### Phone Field handling

The phone field is split into three DOM elements: `#countryTrigger`, `#nationalNumber`,
and `#phone`. `main.js::recomputeHiddenPhone()` recalculates `#phone` based on picker
selections and national number.

### Country Picker Fallback

If `loadCountries()` fails (e.g., due to network issues), `main.js::fallbackToPlainPhoneInput()`
switches to a visible phone input, losing the country picker UI.

### Countries Data & Search

`countries.json` stores country data. Load and cache it with deduplication using
`_resetForTests(seed)` for deterministic results in tests.

### Git Workflow

- Commit messages follow Conventional Commits format.
- No WIP commits; each commit should be logically atomic.
- Stage and summarize changes before pushing.

## Testing quirks

- Integration tests run under jsdom, requiring the `// @vitest-environment jsdom`
  pragma at the top of test files.
- For clean module state per test in integration tests, use `vi.resetModules()`
  and dynamically import main.js, then wait for promise resolution with two ticks
  using `new Promise`.

## Missing Setup / Test Prerequisites

- Ensure you have Node.js installed (minimum version required in documentation).
