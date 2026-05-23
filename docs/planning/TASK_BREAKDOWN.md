# Task Breakdown: Claude Code Contact Form

## 1. Execution Strategy

The work is grouped bottom-up:

1. Establish project structure.
2. Build static HTML foundation.
3. Add styling and responsive layout.
4. Add pure validation logic.
5. Bind validation logic to the DOM.
6. Add submission behavior.
7. Add tests.
8. Add documentation.
9. Perform final review.

Run the batches in order. For each batch, give Claude Code the prompt file
listed in the batch overview and use the task table as the acceptance checklist.
The prompt file is the executable handoff; the task table explains what done
means.

If handing this whole document to Claude Code, instruct it to start at Batch 01
and continue sequentially through Batch 12, using the matching prompt path for
each batch. The numbered prompt files are the batch prompts. The
`docs/prompts/README.md` file is supporting documentation, not a batch prompt.

## 2. Batch Overview

| Batch | Category | Prompt File | Goal | Output |
| --- | --- | --- | --- | --- |
| 01 | Foundation | `docs/prompts/01_PROJECT_SCAFFOLD.md` | Create folders and baseline files. | Project scaffold. |
| 02 | HTML | `docs/prompts/02_HTML_STRUCTURE_SEO_ACCESSIBILITY.md` | Build semantic, SEO-aware form structure. | `index.html`. |
| 03 | CSS | `docs/prompts/03_CSS_LAYOUT_RESPONSIVE.md` | Build clean responsive styling. | `css/styles.css`. |
| 04 | Validation Core | `docs/prompts/04_VALIDATION_CORE.md` | Add pure validation functions. | `javascript/validation.js`. |
| 05 | DOM Integration | `docs/prompts/05_VALIDATION_DOM_INTEGRATION.md` | Connect validation to fields and events. | `javascript/main.js`. |
| 06 | Submit Flow | `docs/prompts/06_SUBMISSION_SUCCESS_FLOW.md` | Add success flow, reset, and timer. | Updated JS/CSS. |
| 07 | Submitted Data Popup | `docs/prompts/07_SUBMITTED_DATA_POPUP.md` | Add submitted-details popup. | Updated HTML, CSS, and JS. |
| 08 | Unit Tests | `docs/prompts/08_UNIT_TESTS.md` | Test validation functions. | `tests/unit/validation.test.js`. |
| 09 | Integration Tests | `docs/prompts/09_INTEGRATION_TESTS.md` | Test DOM behavior. | `tests/integration/form.integration.test.js`. |
| 10 | E2E Tests | `docs/prompts/10_E2E_TESTS.md` | Test browser user flows. | `tests/e2e/contact-form.spec.js`. |
| 11 | Documentation | `docs/prompts/11_README_DOCUMENTATION.md` | Create beginner README. | `README.md`. |
| 12 | Final Review | `docs/prompts/12_FINAL_REVIEW.md` | Validate against requirements. | Clean final project. |

## 3. Batch 01: Project Scaffold

### Goal

Create the required project structure with clear directories for source,
assignment docs, planning docs, prompts, images, and tests.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B01-T01 | Create root project folder `claude-code-contact-form`. | Small | Folder exists. |
| B01-T02 | Create directories: `docs/assignment`, `docs/planning`, `docs/prompts`, `images`, `css`, `javascript`, `tests/unit`, `tests/integration`, `tests/e2e`. | Small | All directories exist. |
| B01-T03 | Create empty baseline files: `index.html`, `css/styles.css`, `javascript/validation.js`, `javascript/main.js`, `README.md`. | Small | Files exist. |
| B01-T04 | Create `package.json`, `vitest.config.js`, and `playwright.config.js` for test tooling. | Medium | Test scripts exist but may initially fail until implementation is added. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/01_PROJECT_SCAFFOLD.md
```

## 4. Batch 02: HTML Structure, SEO, Accessibility

### Goal

Build the static form structure using semantic HTML, labels, error containers,
SEO metadata, and script/style references.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B02-T01 | Add standard HTML5 document structure. | Small | `index.html` has valid `doctype`, `html`, `head`, and `body`. |
| B02-T02 | Add SEO metadata. | Small | Title, meta description, charset, and viewport exist. |
| B02-T03 | Add semantic page structure. | Small | Uses `main`, `section`, `h1`, and intro text. |
| B02-T04 | Add contact form fields. | Medium | Full name, email, phone, message, and submit button exist. |
| B02-T05 | Add placeholders and labels. | Small | Every field has visible label and placeholder. |
| B02-T06 | Add error containers and ARIA wiring. | Medium | Each field has an error element referenced by `aria-describedby`. |
| B02-T07 | Add submitted-details popup container. | Small | Popup element exists with `role="dialog"` and `aria-modal="true"`. |
| B02-T08 | Link CSS and JS files. | Small | CSS loads in head; JS loads at end of body with `type="module"`. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/02_HTML_STRUCTURE_SEO_ACCESSIBILITY.md
```

## 5. Batch 03: CSS Layout and Responsive Design

### Goal

Style the form with clean layout, readable spacing, validation states, disabled
button style, and success animation.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B03-T01 | Add global reset and base typography. | Small | Page has consistent sizing and readable font. |
| B03-T02 | Center the form container. | Small | Form appears centered and constrained. |
| B03-T03 | Style labels, inputs, textarea, and button. | Medium | Form is clean and readable. |
| B03-T04 | Add responsive behavior. | Small | Form works on mobile widths. |
| B03-T05 | Add `.is-valid` and `.is-invalid` states. | Small | Green and red borders are available. |
| B03-T06 | Add `.error-message` styling. | Small | Error text is red and readable. |
| B03-T07 | Add success-message styling and fade-in animation. | Medium | Success message appears green and animated. |
| B03-T08 | Add disabled/submitting button styling. | Small | Disabled button appears gray. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/03_CSS_LAYOUT_RESPONSIVE.md
```

## 6. Batch 04: Pure Validation and Country Utilities

### Goal

Implement validation and country-data helpers in isolated pure functions
before touching the DOM.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B04-T01 | Add validation-result JSDoc typedef. | Small | `ValidationResult` typedef exists. |
| B04-T02 | Add regex constants. | Small | Name, email, and phone regex constants exist. |
| B04-T03 | Implement `validateFullName`. | Medium | Required, length, and regex checks work. |
| B04-T04 | Implement `validateEmail`. | Small | Required and regex checks work. |
| B04-T05 | Implement `validatePhone`. | Small | Required, 7-17 character length, and `^\+[1-9]\d{0,3} [1-9]\d{3,13}$` regex checks work. |
| B04-T06 | Implement `stripLeadingZero`. | Small | Removes exactly one leading `0` before phone concatenation. |
| B04-T07 | Implement `validateMessage`. | Small | Required and min 10 checks work. |
| B04-T08 | Implement `validateFormData`. | Medium | Returns validation results for all fields. |
| B04-T09 | Implement `countries.js` loader and search helpers. | Medium | Countries load once, cache, and search by ISO/name/dial code in ranked order. |
| B04-T10 | Export functions for tests and DOM integration. | Small | Functions can be imported by tests and main JS. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/04_VALIDATION_CORE.md
```

## 7. Batch 05: DOM Validation Integration

### Goal

Connect the pure validators to form fields and field-level feedback.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B05-T01 | Select form, inputs, error elements, submitted-details popup, and submit button. | Small | DOM references are centralized. |
| B05-T02 | Implement `getFormData`. | Small | Reads values from all fields. |
| B05-T03 | Implement `renderFieldState`. | Medium | Updates error text, classes, and `aria-invalid`. |
| B05-T04 | Implement `validateSingleField`. | Medium | Validates one field using its validator. |
| B05-T05 | Add `blur` listeners to fields. | Small | Tabbing away validates the field. |
| B05-T06 | Implement `validateAllFields`. | Medium | Validates all fields and renders all states. |
| B05-T07 | Add submit listener with `event.preventDefault`. | Small | Browser does not perform native submit navigation. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/05_VALIDATION_DOM_INTEGRATION.md
```

## 8. Batch 06: Submission Success Flow

### Goal

Implement the assignment's complete successful-submission behavior.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B06-T01 | Implement `setSubmittingState`. | Small | Button is disabled and gray while submitting. |
| B06-T02 | Implement `showSubmissionPopup`. | Small | Green success popup appears with submitted values. |
| B06-T03 | Implement `hideSubmissionPopup`. | Small | Success popup can be hidden. |
| B06-T04 | Implement `resetFormState`. | Medium | Fields clear and validation borders are removed. |
| B06-T05 | Update submit handler success branch. | Medium | Valid submit triggers disabled state, success, reset, and timer. |
| B06-T06 | Add popup close interactions. | Small | Popup closes from the `X` button or outside click. |
| B06-T07 | Ensure invalid submit does not clear form. | Small | Invalid values remain visible for correction. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/06_SUBMISSION_SUCCESS_FLOW.md
```

## 9. Batch 07: Submitted Data Popup

### Goal

Add the submitted-details popup showing the submitted values.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B07-T01 | Capture submitted data before form clearing. | Small | Data is preserved for the popup. |
| B07-T02 | Fill popup detail fields. | Small | Popup includes name, email, phone, and message. |
| B07-T03 | Wire popup into successful submit branch. | Small | Popup appears only when all fields are valid. |
| B07-T04 | Verify popup content matches typed values. | Small | Values are not empty or reset before the popup renders. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/07_SUBMITTED_DATA_POPUP.md
```

## 10. Batch 08: Unit Tests

### Goal

Test all pure validation rules.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B08-T01 | Configure Vitest unit test script. | Small | `npm run test:unit` exists. |
| B08-T02 | Add valid full-name tests. | Small | English, Hebrew, spaces, hyphen pass. |
| B08-T03 | Add invalid full-name tests. | Medium | Empty, too short, too long, digits, symbols fail. |
| B08-T04 | Add email tests. | Medium | Valid email passes; malformed values fail. |
| B08-T05 | Add phone tests. | Medium | Valid international-style values pass; letters, spaces, leading-zero local values, short values, and long values fail. |
| B08-T06 | Add message tests. | Small | 10+ chars pass; empty and short fail. |
| B08-T07 | Add `validateFormData` tests. | Medium | Aggregate valid and invalid results are correct. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/08_UNIT_TESTS.md
```

## 11. Batch 09: Integration Tests

### Goal

Test validation behavior through the DOM.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B09-T01 | Configure Vitest jsdom environment. | Small | Integration tests run in jsdom. |
| B09-T02 | Load or construct form DOM in test setup. | Medium | Tests can access all fields and messages. |
| B09-T03 | Test blur validation for invalid field. | Medium | Error text and invalid class appear. |
| B09-T04 | Test blur validation for valid field. | Medium | Error clears and valid class appears. |
| B09-T05 | Test invalid submit. | Medium | Multiple field errors appear and success is hidden. |
| B09-T06 | Test valid submit with popup details. | Medium | Popup appears with submitted data and reset happens. |
| B09-T07 | Test popup close paths. | Small | `X` and outside clicks hide the popup. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/09_INTEGRATION_TESTS.md
```

## 12. Batch 10: E2E Tests

### Goal

Validate real browser behavior.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B10-T01 | Configure Playwright. | Medium | `npm run test:e2e` starts a static server and runs tests. |
| B10-T02 | Test page load. | Small | `Contact Us` heading is visible. |
| B10-T03 | Test invalid submission. | Medium | Empty submit shows field errors and no popup. |
| B10-T04 | Test invalid phone with letters. | Small | Phone-specific error appears. |
| B10-T05 | Test valid submission. | Medium | Fill valid values and submit. |
| B10-T06 | Assert popup content. | Medium | Popup includes submitted values. |
| B10-T07 | Assert reset and success behavior. | Medium | Fields clear, success appears, then disappears. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/10_E2E_TESTS.md
```

## 13. Batch 11: README Documentation

### Goal

Create beginner-readable documentation that satisfies the assignment.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B11-T01 | Add project overview. | Small | README explains purpose. |
| B11-T02 | Add project structure section. | Small | README shows relevant files and folders. |
| B11-T03 | Add run instructions. | Small | Browser and optional local server instructions exist. |
| B11-T04 | Add validation rules table. | Small | README lists all field rules. |
| B11-T05 | Add testing instructions. | Medium | README documents unit, integration, and E2E test commands. |
| B11-T06 | Add reflection answers. | Medium | README answers assignment reflection questions. |
| B11-T07 | Add production improvement notes. | Small | README explains the popup is local-only for this exercise. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/11_README_DOCUMENTATION.md
```

## 14. Batch 12: Final Review and Cleanup

### Goal

Run a final verification pass against the PRD, technical spec, and assignment checklist.

### Tasks

| ID | Task | Size | Acceptance Criteria |
| --- | --- | --- | --- |
| B12-T01 | Review form structure. | Small | Required fields and labels exist. |
| B12-T02 | Review validation rules. | Medium | Final rules match PRD and technical spec. |
| B12-T03 | Review UX states. | Medium | Red/green borders, errors, success, animation, disabled button work. |
| B12-T04 | Review tests. | Medium | Unit, integration, and E2E tests pass. |
| B12-T05 | Review JSDoc. | Small | Reusable JS functions have JSDoc. |
| B12-T06 | Review SEO and accessibility. | Medium | Metadata, labels, ARIA, and keyboard flow are present. |
| B12-T07 | Review README. | Small | README satisfies assignment documentation requirements. |
| B12-T08 | Initialize Git and commit. | Small | Clean commit exists. |

### Prompt File

Use this Claude Code prompt:

```text
docs/prompts/12_FINAL_REVIEW.md
```

## 15. Recommended Command Sequence

```bash
npm install
npm run test:unit
npm run test:integration
npm run test:e2e
git init
git add .
git commit -m "Claude Code generated contact form with validation"
```

## 16. Traceability Matrix

| Requirement Area | Covered By |
| --- | --- |
| HTML fields | B02 |
| SEO | B02, B12 |
| CSS styling | B03 |
| Validation rules | B04, B05, B08 |
| Error feedback | B05, B09, B10 |
| Success behavior | B06, B09, B10 |
| Alert | B07, B10 |
| Reset behavior | B06, B09, B10 |
| README | B11 |
| JSDoc | B04, B05, B12 |
| Unit tests | B08 |
| Integration tests | B09 |
| E2E tests | B10 |
| Git save | B12 |
