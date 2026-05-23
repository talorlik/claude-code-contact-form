# Claude Code Contact Form

This project is a beginner-friendly contact form built with HTML, CSS, and
vanilla JavaScript. It validates user input in the browser, shows clear
field-level feedback, confirms successful submissions, displays the submitted
data in a temporary alert, and resets the form after submission.

The project is based on Assignment 2, "Build a Contact Form With Data
Validation." The app does not use a backend server, database, or frontend
framework.

## Table of Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Validation Rules](#validation-rules)
- [UX Behavior](#ux-behavior)
- [Testing](#testing)
- [Manual Test Data](#manual-test-data)
- [What I Learned](#what-i-learned)
- [Reflection Questions](#reflection-questions)
- [Production Note](#production-note)
- [Supporting Documentation](#supporting-documentation)

## Screenshots

Add screenshots to the `images/` folder when the form is implemented:

- Before successful submission: `images/before-success.png`
- After successful submission: `images/after-success.png`
- Optional validation errors: `images/validation-errors.png`

## Features

- Contact form with Full Name, Email, Phone, and Message fields.
- Required-field validation for every input.
- Field-specific red error messages.
- Red borders for invalid fields and green borders for valid fields.
- Green success message with a short fade-in animation.
- Submit button disabled briefly while the form is submitting.
- Alert showing the submitted data for assignment testing.
- Form clearing after successful submission.
- Success message hidden automatically after 3 seconds.

## Project Structure

The planned project structure is:

```text
claude-code-contact-form/
  docs/
    assignment/
      ASSIGNMENT.md
    planning/
      PRD.md
      TASK_BREAKDOWN.md
      TECHNICAL_REQUIREMENTS.md
    prompts/
      README.md
      01_project_scaffold.md
      ...
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
  package.json
  playwright.config.js
  vitest.config.js
  README.md
```

## How to Run

### Option 1: Open in a Browser

1. Open the project folder.
2. Open `index.html` directly in a modern browser.
3. Fill in the form and click Submit.

### Option 2: Use Live Server

1. Install the Live Server extension in VS Code or Cursor.
2. Right-click `index.html`.
3. Select `Open with Live Server`.

### Option 3: Use a Local Static Server

If Node.js is available, run a temporary static server from the project root:

```bash
npx serve .
```

Then open the local URL shown in the terminal.

## Validation Rules

| Field | Rules | Example Valid Value |
| --- | --- | --- |
| Full Name | Required, 2-30 characters, English or Hebrew letters, spaces, dots, and hyphens only. Regex: `^[a-zA-Zא-ת .-]+$` | `Taylor Smith` |
| Email | Required and must use a valid email format. Regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | `taylor@example.com` |
| Phone | Required, 8-15 characters, optional leading `+`, then digits starting with `1-9`. Regex: `^\+?[1-9]\d{1,14}$` | `+972541234567` |
| Message | Required and at least 10 characters after trimming whitespace. | `I would like more information.` |

> [!NOTE]
> The phone rule follows the assignment's Step 3 requirement. Because the
> regex starts with `[1-9]`, local numbers starting with `0`, such as
> `0541234567`, are treated as invalid. Use an international-style value such
> as `+972541234567` for valid testing.

## UX Behavior

When a field is invalid, the form shows a specific red error message under that
field and applies a red border. When a field is valid, the form applies a green
border.

On a valid submission, the app captures the submitted data, briefly disables the
Submit button, displays an alert with the submitted values, shows a green
success message, clears the form, removes validation borders, and hides the
success message after 3 seconds.

## Testing

The application itself runs in the browser with plain HTML, CSS, and
JavaScript. The recommended test tooling uses Node.js development dependencies.

Install dependencies when `package.json` is available:

```bash
npm install
```

Run unit tests for pure validation logic:

```bash
npm run test:unit
```

Run integration tests for DOM validation behavior:

```bash
npm run test:integration
```

Run end-to-end tests in a real browser:

```bash
npm run test:e2e
```

## Manual Test Data

Use these values for a successful manual test:

| Field | Value |
| --- | --- |
| Full Name | `Taylor Smith` |
| Email | `taylor@example.com` |
| Phone | `+972541234567` |
| Message | `I would like more information.` |

Use these values to confirm validation errors:

- Empty Full Name.
- Email without `@`.
- Phone with letters, such as `054abc4567`.
- Phone that is too short, such as `1234567`.
- Message shorter than 10 characters.

## What I Learned

This project helped me practice building a small form from HTML, CSS, and
JavaScript without relying on a framework. I learned how to connect form fields
to validation rules, show helpful error messages, update visual states, and
test a browser-only workflow.

I also learned how Claude Code can help break an assignment into smaller steps:
first planning the structure, then building validation, then adding user
feedback, tests, and documentation.

## Reflection Questions

**Which validation rule was easiest to understand?**

The required-field validation was the easiest because each field only needs to
be checked for an empty value after trimming whitespace.

**Which validation rule was hardest to test?**

The phone validation was the hardest because it combines length rules, an
optional leading `+`, and a regex that rejects local numbers starting with `0`.

**How did Claude Code help you move from one version to the next?**

Claude Code helped by turning the assignment into clear implementation batches,
including form structure, styling, validation logic, DOM behavior, success flow,
tests, and documentation.

**What would you improve if this form were used on a real website?**

For a real website, I would replace the alert with a secure backend submission,
add spam protection, avoid exposing submitted personal data, add stronger
server-side validation, and show a real confirmation after the server accepts
the message.

## Production Note

The submitted-data alert is only for this exercise. Real websites usually send
form data to a backend server over HTTPS, validate it again on the server, and
store or process it securely. This assignment intentionally keeps everything in
the browser so the validation behavior is easy to inspect and test.

## Supporting Documentation

- `docs/assignment/ASSIGNMENT.md` contains the source assignment brief.
- `docs/planning/PRD.md` describes product requirements.
- `docs/planning/TECHNICAL_REQUIREMENTS.md` describes technical requirements.
- `docs/planning/TASK_BREAKDOWN.md` lists the implementation batches.
- `docs/prompts/` contains the Claude Code prompts for each batch.
