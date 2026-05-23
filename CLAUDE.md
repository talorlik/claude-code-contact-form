# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Type

Browser-only contact form. No build step, no bundler, no framework, no
backend. HTML, CSS, and vanilla ES modules served as static files.
`index.html` loads `javascript/main.js` directly via `<script type="module">`.

## Commands

Install dev dependencies (only needed for tests):

```bash
npm install
```

Tests:

```bash
npm run test              # unit + integration (vitest run)
npm run test:unit         # vitest run tests/unit (Node env)
npm run test:integration  # vitest run tests/integration (jsdom env)
npm run test:e2e          # Playwright; auto-starts `npx serve` on :4173
```

Run a single Vitest file or test by name:

```bash
npx vitest run tests/unit/validation.test.js
npx vitest run -t "validateFullName rejects empty"
```

Run a single Playwright test:

```bash
npx playwright test tests/e2e/contact-form.spec.js -g "submits successfully"
```

Serve locally for manual browser checks (same port Playwright expects):

```bash
npm run serve   # npx serve -l 4173 .
```

Then open `http://localhost:4173`. Opening `index.html` via `file://` also
works, except `data/countries.json` will fail to `fetch()`, which triggers
the plain-phone-input fallback path in `main.js`.

## Architecture

### Strict pure-vs-DOM split

This split is load-bearing for the test strategy; preserve it when editing.

- `javascript/validation.js` and `javascript/countries.js` are **pure** modules.
  They never touch `document` / `window`. Unit tests run them under Node.
- `javascript/countryPicker.js` and `javascript/main.js` are **DOM** modules.
  Integration tests run them under jsdom via the `// @vitest-environment
  jsdom` pragma at the top of each integration test, routed through
  `vitest.config.js`'s `environmentMatchGlobs`.

When adding new validators or data utilities, put them in a pure module so
they stay unit-testable without jsdom.

### Phone field: visible national input + hidden mirror

The phone field has unusual plumbing. Three DOM elements cooperate:

- `#countryTrigger` + `#countryPopover` - the country picker UI
  (`countryPicker.js`). Provides the dial code.
- `#nationalNumber` - the visible input the user types into.
- `#phone` - a `type="hidden"` input that holds the concatenated value
  `+<dialCode> <nationalNumber>` and is what gets validated and "submitted".

`main.js::recomputeHiddenPhone()` rebuilds `#phone` from the picker
selection and `#nationalNumber`, stripping exactly one leading `0` via
`validation.js::stripLeadingZero()`. `PHONE_REGEX` in `validation.js` is
applied to the concatenated `+<code> <national>` string, not to either
piece alone. The validator does not call `stripLeadingZero` itself; callers
must strip before concatenating.

`inputs.phone` in `main.js` points at `#nationalNumber` (what the user sees
and what gets the blur listener and validation classes), but
`validateSingleField("phone")` reads from `#phone` after recomputing.

### Country-picker failure fallback

If `loadCountries()` (in `countries.js`) fails - typically `file://` with no
HTTP server, or a network error - `main.js::fallbackToPlainPhoneInput()`
swaps the hidden `#phone` back to a visible `<input type="tel">`, hides the
picker UI and `#nationalNumber`, and repoints `inputs.phone` at `#phone`
itself. After fallback the user types the full `+<code> <number>` string
themselves. Validation logic does not change. Keep this fallback working
when refactoring the boot sequence at the bottom of `main.js`.

### Countries data + search

`data/countries.json` is the source of truth for countries. `countries.js`
loads it once (with an in-flight-promise dedupe), caches the parsed array
at module scope, and exposes `searchCountries(query)` which returns matches
in a fixed tier order: exact iso2 → name startsWith → dialCode startsWith →
substring. Tests rely on this ordering. `_resetForTests(seed)` bypasses
fetch and seeds the cache directly; use it in any new test that needs a
deterministic country list.

### Integration-test setup pattern

`tests/integration/form.integration.test.js` reloads `index.html` into
jsdom, then `vi.resetModules()` + dynamically imports `main.js` so its
module-scope DOM lookups bind to the freshly-loaded document. Two
`await new Promise(r => setTimeout(r, 0))` ticks let the picker boot
promise resolve. Follow the same pattern for new integration tests that
need a clean module state per test.

## Validation rules (authoritative)

Regexes and limits live in `javascript/validation.js` as exported
constants (`NAME_REGEX`, `EMAIL_REGEX`, `PHONE_REGEX`, `NAME_MIN/MAX`,
`PHONE_MIN/MAX`, `MESSAGE_MIN`). The README documents the user-facing
rules; the constants in this file are the source of truth. When changing
a rule, update the constant and let the existing tests + error messages
flow from it.

## Conventions specific to this repo

- ES modules only (`"type": "module"` in `package.json`). Use `import`/
  `export`, not `require`.
- JSDoc typedefs document shapes (`FormData`, `ValidationResult`,
  `Country`, `CountryPickerApi`). There is no TypeScript; preserve the
  JSDoc when editing.
- Markdown follows `.markdownlint.json`: duplicate headings allowed only
  when not siblings; line-length rule ignores code blocks and tables.
- `.claude/` and `test-results/` are gitignored. Do not commit Playwright
  artifacts.

## README and planning docs

The README is comprehensive and aimed at the assignment grader; do not
duplicate its content here. Treat `docs/planning/PRD.md`,
`docs/planning/TECHNICAL_REQUIREMENTS.md`, and
`docs/planning/TASK_BREAKDOWN.md` as the spec when behavior is ambiguous -
they describe the intended UX (red/green borders, submit-button disabled
state, and submitted-details success popup) in detail.
