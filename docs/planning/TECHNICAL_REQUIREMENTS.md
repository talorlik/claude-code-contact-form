# Technical Requirements Specification: Claude Code Contact Form

## 1. Overview

This document defines the technical implementation requirements for a static
contact-form project built with HTML, CSS, and JavaScript.

The application runs entirely in the browser. It performs client-side
validation, updates the DOM with field-specific feedback, simulates a successful
submission, shows an alert with submitted data, and resets the form.

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
  docs/
    assignment/
      ASSIGNMENT.md
    planning/
      PRD.md
      TECHNICAL_REQUIREMENTS.md
      TASK_BREAKDOWN.md
    prompts/
      01_project_scaffold.md
      02_html_structure_seo_accessibility.md
      03_css_layout_responsive.md
      04_validation_core.md
      05_validation_dom_integration.md
      06_submission_success_flow.md
      07_test_alert.md
      08_unit_tests.md
      09_integration_tests.md
      10_e2e_tests.md
      11_readme_documentation.md
      12_final_review.md
  images/
  css/
    styles.css
  javascript/
    validation.js
    main.js
  tests/
    unit/
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
| Phone | `input type="tel"` | `phone` | `phone` |
| Message | `textarea` | `message` | `message` |

Required feedback elements:

| Element | ID |
| --- | --- |
| Full Name error | `fullNameError` |
| Email error | `emailError` |
| Phone error | `phoneError` |
| Message error | `messageError` |
| Success message | `successMessage` |

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
| `.success-message` | Green success message box. |
| `.success-message.is-visible` | Visible animated success state. |
| `.submit-button.is-submitting` | Gray disabled submit state. |

### 6.3 Animation

The success message must use a short fade-in animation.

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
| `javascript/validation.js` | Pure validation functions and regex constants. |
| `javascript/main.js` | DOM selection, event listeners, rendering feedback, submit behavior. |

### 7.2 Data Model

Use plain objects.

```js
{
  fullName: "Taylor Smith",
  email: "taylor@example.com",
  phone: "+972541234567",
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

### 7.5 Required DOM Functions

| Function | Responsibility |
| --- | --- |
| `getFormData()` | Read current field values from the DOM. |
| `renderFieldState(fieldName, result)` | Apply error text, border state, and ARIA state. |
| `validateSingleField(fieldName)` | Validate one field on blur. |
| `validateAllFields()` | Validate all fields on submit. |
| `setSubmittingState(isSubmitting)` | Disable/enable button and toggle gray style. |
| `showSuccessMessage()` | Show green animated success message. |
| `hideSuccessMessage()` | Hide success message. |
| `resetFormState()` | Clear inputs and remove validation borders. |
| `showSubmittedDataAlert(formData)` | Alert submitted data. |

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

Rules:

1. Trim whitespace before validation.
2. Required.
3. Minimum length: 8 characters.
4. Maximum length: 15 characters.
5. Must match:

```js
/^\+?[1-9]\d{1,14}$/
```

Example valid values:

- `12345678`
- `+972541234567`
- `972541234567`

Example invalid values:

- Empty string.
- `1234567`.
- `+97254123456789`.
- `054abc4567`.
- `0541234567` because the declared regex does not allow a leading `0`.
- `972 541 234567`.

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
   - No success message.
   - No alert.
   - Form is not cleared.
5. Valid fields:
   - Receive green borders.
   - Set `aria-invalid="false"`.
6. Capture submitted data before clearing.
7. Disable submit button briefly.
8. Show alert with submitted data.
9. Show green success message.
10. Clear all fields.
11. Remove green borders.
12. Re-enable submit button.
13. Hide success message after 3 seconds.

## 10. Alert Format

The alert must include the submitted values.

Example:

```text
Submitted Data:

Name: Taylor Smith
Email: taylor@example.com
Phone: +972541234567
Message: I would like more information.
```

## 11. Accessibility Requirements

| ID | Requirement |
| --- | --- |
| A11Y-001 | Every input must have a visible label. |
| A11Y-002 | Error messages must be programmatically associated with fields. |
| A11Y-003 | `aria-invalid` must reflect current field validity. |
| A11Y-004 | The success message should use `role="status"` or `aria-live="polite"`. |
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
- Valid minimum-length phone.
- Valid international-style phone with leading `+`.
- Valid phone without leading `+`.
- Phone with letters.
- Phone with spaces.
- Phone starting with `0`.
- Too-short phone.
- Too-long phone.
- Valid message.
- Empty message.
- Short message.
- `validateFormData` with all valid data.
- `validateFormData` with multiple invalid fields.

### 14.2 Integration Tests

Must cover:

- Field blur triggers validation.
- Error message appears below invalid field.
- Invalid field receives `.is-invalid`.
- Valid field receives `.is-valid`.
- Submit with invalid values does not show success.
- Submit with valid values shows success.
- Form reset clears fields.
- Success message hides after timer.

### 14.3 E2E Tests

Must cover:

- Page loads with `Contact Us`.
- Invalid submission shows errors.
- Valid submission triggers alert with submitted data.
- Valid submission clears the form.
- Success message appears and later disappears.

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
- The alert is a visible local-only testing mechanism.
- In a production system, replace the alert with secure backend submission.

## 17. Git Requirements

Recommended commands:

```bash
git init
git add .
git commit -m "Claude Code generated contact form with validation"
```

Run commands one at a time and verify each succeeds.
