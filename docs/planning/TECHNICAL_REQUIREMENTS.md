# Technical Requirements Specification: Claude Code Contact Form

## 1. Overview

This document defines the technical implementation requirements for a static
contact-form project built with HTML, CSS, and JavaScript.

The application runs entirely in the browser. It performs client-side
validation, updates the DOM with field-specific feedback, simulates a successful
submission, shows a submitted-details popup, and resets the form.

## 2. Runtime Technology Stack

| Layer | Technology | Requirement |
| --- | --- | --- |
| Markup | HTML5 | Semantic structure, accessible form controls, SEO metadata. |
| Styling | CSS3 | External stylesheet, responsive layout, validation states, success animation. |
| Behavior | Vanilla JavaScript | External JS files, no frontend framework. |
| Runtime Hosting | Static browser execution | Open via browser or local static server. |

## 3. Development and Test Tooling

The application runtime remains plain HTML, CSS, and JavaScript. Test tooling
may use Node.js dev dependencies.

| Purpose | Recommended Tool |
| --- | --- |
| Unit tests | Vitest |
| DOM integration tests | Vitest + jsdom |
| E2E tests | Playwright |
| Static local serving | VS Code Live Server or `npx serve` |
| Formatting | Prettier, optional |
| Version control | Git |

## 4. Required Project Structure

```text
claude-code-contact-form/
  data/
    countries.json
  docs/
    assignment/
      ASSIGNMENT.md
    planning/
      PRD.md
      TECHNICAL_REQUIREMENTS.md
      TASK_BREAKDOWN.md
    prompts/
      01_PROJECT_SCAFFOLD.md
      02_HTML_STRUCTURE_SEO_ACCESSIBILITY.md
      03_CSS_LAYOUT_RESPONSIVE.md
      04_VALIDATION_CORE.md
      05_VALIDATION_DOM_INTEGRATION.md
      06_SUBMISSION_SUCCESS_FLOW.md
      07_SUBMITTED_DATA_POPUP.md
      08_UNIT_TESTS.md
      09_INTEGRATION_TESTS.md
      10_E2E_TESTS.md
      11_README_DOCUMENTATION.md
      12_FINAL_REVIEW.md
  images/
  css/
    styles.css
  javascript/
    countries.js
    countryPicker.js
    main.js
    validation.js
  tests/
    unit/
      countries.test.js
      validation.test.js
    integration/
      form.integration.test.js
    e2e/
      contact-form.spec.js
  index.html
  README.md
  package.json
  playwright.config.js
  vitest.config.js
```

Minimum assignment structure remains valid if test tooling is omitted, but the
recommended structure above supports the requested test coverage.

## 5. HTML Requirements

### 5.1 Document Metadata

`index.html` must include:

```html
<title>Contact Us | Contact Form</title>
<meta name="description" content="A beginner-friendly contact form with client-side validation using HTML, CSS, and JavaScript.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="UTF-8">
```

### 5.2 Semantic Structure

Required structure:

```text
body
  main
    section/contact-card
      h1
      p/introduction
      form#contactForm
```

### 5.3 Form Controls

Each field must include:

- A visible `<label>`.
- A unique `id`.
- A matching `name`.
- A placeholder.
- An error container.
- `aria-describedby` referencing the error container.
- `aria-invalid` updated by JavaScript.

Required field IDs:

| Field | Element | ID | Name |
| --- | --- | --- | --- |
| Full Name | `input type="text"` | `fullName` | `fullName` |
| Email | `input type="email"` | `email` | `email` |
| Phone (national number, visible) | `input type="tel"` | `nationalNumber` | (none) |
| Phone (concatenated, hidden, submitted) | `input type="hidden"` | `phone` | `phone` |
| Message | `textarea` | `message` | `message` |

The phone field is rendered as a `.phone-input-group` wrapping the country
trigger button, the visible national-number input, and the hidden `#phone`
input that carries the submitted `+<dialCode> <nationalNumber>` value. See
§5.4 for the country-picker requirements.

Required feedback elements:

| Element | ID |
| --- | --- |
| Full Name error | `fullNameError` |
| Email error | `emailError` |
| Phone error | `phoneError` |
| Message error | `messageError` |
| Submitted-details popup | `submissionPopup` |

### 5.4 Country Picker

The phone field includes a country-code picker (combobox) implemented as
a custom widget. Required elements:

| Element | ID | Role |
| --- | --- | --- |
| Trigger button | `countryTrigger` | `combobox` (with `aria-haspopup="listbox"`, `aria-controls="countryList"`, `aria-expanded` toggled by JS) |
| Popover container | `countryPopover` | (presentational; `hidden` toggled by JS) |
| Search input | `countrySearch` | text input inside the popover, type-to-filter |
| Options list | `countryList` | `listbox`, contains `option` items |

The trigger button displays the selected country's flag emoji and dial
code. Options carry `role="option"`, `data-iso2`, and `aria-selected`.
While the popover is open, the search input's `aria-activedescendant`
points at the currently active option (Arrow Up/Down navigation).

Keyboard behavior:

- `Arrow Down` / `Enter` / `Space` on the trigger opens the popover.
- `Arrow Up` / `Arrow Down` move the active option (focus stays on the
  search input).
- `Home` / `End` jump to the first/last option.
- `Enter` selects the active option and closes the popover.
- `Escape` closes the popover and returns focus to the trigger.
- Clicking outside the popover closes it.

## 6. CSS Requirements

### 6.1 Layout

- Center the form on the page.
- Use readable spacing.
- Use a constrained max-width for the form container.
- Support mobile screens.
- Use `box-sizing: border-box`.

### 6.2 Visual States

Required CSS classes:

| Class | Purpose |
| --- | --- |
| `.is-valid` | Green border for valid fields. |
| `.is-invalid` | Red border for invalid fields. |
| `.error-message` | Red field-level error text. |
| `.submission-popup` | Fixed green halo overlay for submitted details. |
| `.submission-popup.is-visible` | Visible animated popup state. |
| `.submission-popup__card` | White popup card containing the success text and submitted details. |
| `.submission-popup__close` | `X` close button inside the popup card. |
| `.submit-button.is-submitting` | Gray disabled submit state. |
| `.phone-input-group` | Flex wrapper that draws a single rounded border around the country trigger + national input. Tints green/red when the national input is `.is-valid` / `.is-invalid`. |
| `.country-trigger` | Combobox trigger button (flag, dial code, caret). |
| `.country-popover` | Absolutely-positioned panel containing the search and option list. Hidden by default via the `[hidden]` attribute. |
| `.country-search` | Search input inside the popover. |
| `.country-list` | Scrollable `<ul role="listbox">` of options. |
| `.country-option` | Individual option (flag, name, dial code). Variants: `.is-active` (keyboard-active), `.is-selected` (current selection). |

### 6.3 Animation

The submitted-details popup must use a short fade-in animation.

Example:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 7. JavaScript Architecture

### 7.1 File Responsibilities

| File | Responsibility |
| --- | --- |
| `javascript/validation.js` | Pure validation functions, regex constants, and `stripLeadingZero` helper. |
| `javascript/countries.js` | Loads `data/countries.json` once; pure search/lookup helpers. |
| `javascript/countryPicker.js` | Generic searchable-combobox factory (DOM, ARIA, keyboard nav). |
| `javascript/main.js` | DOM selection, event listeners, country-picker wiring, rendering feedback, submit behavior. |

### 7.2 Data Model

Use plain objects. The `phone` value carries the concatenated
`+<dialCode> <nationalNumber>` form that the country picker assembles
from its selection and the visible national-number input.

```js
{
  fullName: "Taylor Smith",
  email: "taylor@example.com",
  phone: "+972 541234567",
  message: "I would like more information."
}
```

### 7.3 Validation Result Model

Each validator must return a predictable result object.

```js
{
  isValid: true,
  message: ""
}
```

or:

```js
{
  isValid: false,
  message: "Full name must be between 2 and 30 characters."
}
```

Recommended typedef:

```js
/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the value passed validation.
 * @property {string} message - Error message when invalid, otherwise an empty string.
 */
```

### 7.4 Required Validation Functions

| Function | Input | Output |
| --- | --- | --- |
| `validateFullName(value)` | string | `ValidationResult` |
| `validateEmail(value)` | string | `ValidationResult` |
| `validatePhone(value)` | string | `ValidationResult` |
| `validateMessage(value)` | string | `ValidationResult` |
| `validateFormData(formData)` | object | object keyed by field name |
| `stripLeadingZero(value)` | string | string (removes exactly one leading `0`) |

### 7.5 Required DOM Functions

| Function | Responsibility |
| --- | --- |
| `getFormData()` | Read current field values from the DOM. Reads the hidden `#phone` value (which is kept in sync by `recomputeHiddenPhone`). |
| `recomputeHiddenPhone()` | Reads the current country selection and national-number input, strips a single leading `0`, and writes `+<dialCode> <nationalNumber>` to the hidden `#phone`. |
| `renderFieldState(fieldName, result)` | Apply error text, border state, and ARIA state to the visible element for the field (national-number input for `phone`). |
| `validateSingleField(fieldName)` | Validate one field on blur. For `phone`, recomputes the hidden mirror first, then validates the concatenated value. |
| `validateAllFields()` | Validate all fields on submit (recomputes the hidden phone first). |
| `setSubmittingState(isSubmitting)` | Disable/enable button and toggle gray style. |
| `showSubmissionPopup(formData)` | Show the green animated success popup with submitted values. |
| `hideSubmissionPopup()` | Hide the submitted-details popup. |
| `resetFormState()` | Clear inputs and remove validation borders. Resets the country picker to the default (Israel). |

### 7.6 Country Picker Functions

| Function | Responsibility |
| --- | --- |
| `loadCountries()` | Fetch `data/countries.json` once, cache the result, return a promise. |
| `getCountries()` | Return the cached country array (throws if not loaded). |
| `findByIso2(code)` | Case-insensitive lookup by ISO 3166-1 alpha-2 code. |
| `searchCountries(query)` | Case-insensitive search across name, ISO2, ISO3, and dial code. Returns matches ranked by exact ISO2 → name startsWith → dial-code startsWith → substring. |
| `createCountryPicker(options)` | Factory that wires pre-existing DOM elements into a searchable combobox. Returns `{ open, close, getSelected, setSelectedByIso2 }`. |

## 8. Validation Requirements

### 8.1 Full Name

Rules:

1. Trim whitespace before validation.
2. Required.
3. Minimum length: 2 characters.
4. Maximum length: 30 characters.
5. Must match:

```js
/^[a-zA-Zא-ת .-]+$/
```

Example valid values:

- `Taylor Smith`
- `Tal Orlik`
- `יוסי כהן`
- `Anne-Marie Smith`

Example invalid values:

- Empty string.
- `A`.
- `John123`.
- `John@Smith`.

### 8.2 Email

Rules:

1. Trim whitespace before validation.
2. Required.
3. Must match:

```js
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

Example valid value:

- `taylor@example.com`

Example invalid values:

- Empty string.
- `taylor`.
- `taylor@example`.
- `taylor@`.

### 8.3 Phone

The phone value validated and submitted by the form is the concatenation
of the country picker's dial code and the visible national-number input,
joined by a single space. A single leading `0` in the national-number
input is stripped before concatenation (a common habit for users typing
their local format).

Rules applied to the concatenated value:

1. Trim whitespace before validation.
2. Required.
3. Minimum length: 7 characters (e.g., `+1 1234`).
4. Maximum length: 17 characters (e.g., `+1234 12345678901`).
5. Must match:

```js
/^\+[1-9]\d{0,3} [1-9]\d{3,13}$/
```

Pre-processing (performed by `main.js` before validation):

- `stripLeadingZero(nationalNumberInputValue)` removes exactly one
  leading `0` (so `0541234567` becomes `541234567`).
- The hidden `#phone` value is recomputed as
  `<dialCode> + " " + <strippedNational>` on every national-input
  keystroke and on every country-picker change.

Worked examples:

| National input | Country selected | Submitted `phone` | Valid? |
| --- | --- | --- | --- |
| `0541234567` | Israel (`+972`) | `+972 541234567` | yes |
| `541234567` | Israel (`+972`) | `+972 541234567` | yes |
| `541234567` | United States (`+1`) | `+1 541234567` | yes |
| `00541234567` | Israel (`+972`) | `+972 0541234567` | no - leading `0` in national portion |
| `123` | United States (`+1`) | `+1 123` | no - national portion too short |
| (empty) | Israel (`+972`) | `+972` plus a trailing space | no - national portion missing |

Example invalid concatenated values:

- `972 541234567` (missing leading `+`).
- `+972541234567` (missing the space separator).
- `+972 054abc4567` (letters in the national portion).
- `+972 541 234567` (extra internal spaces).
- `+0 1234567` (dial code starts with `0`).

### 8.4 Message

Rules:

1. Trim whitespace before validation.
2. Required.
3. Minimum length: 10 characters.

Example valid value:

- `I would like more information.`

Example invalid values:

- Empty string.
- `Hi`.
- `Need info`.

## 9. Submit Flow

Required sequence:

1. User clicks Submit.
2. JavaScript prevents default form submission.
3. All fields are validated.
4. Invalid fields:
   - Show error messages.
   - Receive red borders.
   - Set `aria-invalid="true"`.
   - No submitted-details popup.
   - No alert.
   - Form is not cleared.
5. Valid fields:
   - Receive green borders.
   - Set `aria-invalid="false"`.
6. Capture submitted data before clearing.
7. Disable submit button briefly.
8. Show green submitted-details popup with submitted data.
9. Clear all fields.
10. Remove green borders.
11. Re-enable submit button.
12. Keep popup open until the user clicks the `X` button or the green halo
    outside the card.

## 10. Popup Content

The submitted-details popup must include the submitted values. The phone row
shows the concatenated `+<dialCode> <nationalNumber>` form that the picker
assembled (with any leading `0` already stripped).

Example:

```text
Message Sent

Name: Taylor Smith
Email: taylor@example.com
Phone: +972 541234567
Message: I would like more information.
```

## 11. Accessibility Requirements

| ID | Requirement |
| --- | --- |
| A11Y-001 | Every input must have a visible label. |
| A11Y-002 | Error messages must be programmatically associated with fields. |
| A11Y-003 | `aria-invalid` must reflect current field validity. |
| A11Y-004 | The submitted-details popup should use `role="dialog"` and `aria-modal="true"`. |
| A11Y-005 | Error text must not rely on color alone. |
| A11Y-006 | Button disabled state must be visible and semantic. |
| A11Y-007 | The form must be keyboard usable. |

## 12. SEO Requirements

| ID | Requirement |
| --- | --- |
| SEO-001 | Use one clear `h1`: `Contact Us`. |
| SEO-002 | Use a descriptive page title. |
| SEO-003 | Use a descriptive meta description. |
| SEO-004 | Use semantic HTML landmarks. |
| SEO-005 | Avoid empty links and meaningless headings. |
| SEO-006 | Use clean readable content explaining the form purpose. |

## 13. JSDoc Requirements

All exported or reusable JavaScript functions must include JSDoc.

Example:

```js
/**
 * Validates a full name.
 *
 * @param {string} value - Raw full-name input value.
 * @returns {ValidationResult} Validation result with validity and error message.
 */
export function validateFullName(value) {
  // implementation
}
```

## 14. Testing Requirements

### 14.1 Unit Tests

Must cover:

- Valid full name.
- Empty full name.
- Too-short full name.
- Too-long full name.
- Full name with invalid characters.
- Valid email.
- Empty email.
- Malformed email.
- Valid concatenated phone (`+<code> <national>`).
- Phone with missing leading `+`.
- Phone with missing space separator.
- Phone with empty national portion.
- Phone with letters in the national portion.
- Phone with extra internal spaces.
- Phone national portion starting with `0`.
- Phone dial code starting with `0`.
- Too-short phone national portion.
- Too-long phone national portion.
- `stripLeadingZero` removes one `0`, leaves no-leading-zero unchanged,
  keeps a second `0` from `00...`, and handles empty/null input.
- `searchCountries` returns all on empty query, ranks exact ISO2
  matches first, finds by name / ISO3 / dial code (with and without
  leading `+`), and handles no-match queries.
- Valid message.
- Empty message.
- Short message.
- `validateFormData` with all valid data.
- `validateFormData` with multiple invalid fields.

### 14.2 Integration Tests

Must cover:

- Country picker boots with the default country (Israel) shown in the
  trigger.
- Hidden `#phone` is seeded with `+972` plus a trailing space at boot.
- Trigger click opens the popover and focuses the search input.
- Typing in the search filters the option list.
- Clicking an option updates the trigger and recomputes `#phone`.
- Typing a leading `0` into the national input strips it in `#phone`.
- Typing two leading zeros keeps one `0` (validation will then fail).
- Changing the country recomputes `#phone` with the current national
  number.
- Field blur triggers validation.
- Error message appears below invalid field.
- Invalid field receives `.is-invalid`.
- Valid field receives `.is-valid`.
- Submit with invalid values does not show the submitted-details popup.
- Submit with valid values shows the submitted-details popup with the
  concatenated phone.
- Submitted-details popup closes from the `X` button.
- Submitted-details popup closes when clicking outside the card.
- Form reset clears fields and returns the country picker to the
  default.
- Submitted-details popup does not auto-hide after timer.

### 14.3 E2E Tests

Must cover:

- Page loads with `Contact Us`.
- Country picker defaults to Israel and seeds the hidden phone.
- Country picker is searchable by ISO code and by full name.
- Invalid submission shows errors.
- Valid submission strips a leading `0` and shows the popup with the
  concatenated phone (`+972 541234567`).
- Valid submission clears the form and resets the picker.
- Submitted-details popup closes from the `X` button.
- Submitted-details popup closes when clicking outside the card.
- Changing the country re-runs phone validation.

## 15. Browser Support

Target modern browsers:

- Chrome.
- Edge.
- Firefox.
- Safari.

No legacy-browser support is required.

## 16. Security and Privacy Notes

- Do not send data to a server.
- Do not store submitted data.
- Do not log personal data to the console.
- The popup is a visible local-only testing mechanism.
- In a production system, pair the popup with secure backend submission.

## 17. Git Requirements

Recommended commands:

```bash
git init
git add .
git commit -m "Claude Code generated contact form with validation"
```

Run commands one at a time and verify each succeeds.
