# Product Requirements Document: Claude Code Contact Form

## 1. Product Summary

Build a beginner-friendly, browser-only contact-form project using HTML, CSS,
and JavaScript. The form must validate user input in the browser, provide clear
field-level feedback, show a success state after valid submission, display a
temporary alert with submitted data, clear the form, and include
beginner-readable documentation.

## 2. Source Assignment

This PRD is derived from `../assignment/ASSIGNMENT.md`: **Assignment 2: Build
a Contact Form With Data Validation**.

## 3. Product Goals

| ID | Goal | Description |
| --- | --- | --- |
| PG-001 | Build a working contact form | Create a static web page with a usable contact form. |
| PG-002 | Teach browser-side validation | Implement validation without a backend server. |
| PG-003 | Improve beginner UX | Show clear errors, success feedback, visual borders, and placeholders. |
| PG-004 | Practice AI-assisted development | Use Claude Code incrementally through structured prompts. |
| PG-005 | Produce clear documentation | Include a README and supporting project docs. |

## 4. Target Users

| User | Need |
| --- | --- |
| Beginner web-development student | Learn HTML forms, CSS layout, and JavaScript validation. |
| Assignment reviewer | Verify that the form meets all required behavior. |
| Future maintainer | Understand how the project is structured and how validation works. |

## 5. Scope

### 5.1 In Scope

- Static HTML page.
- External CSS file.
- External JavaScript files.
- Contact form with four fields:
  - Full name.
  - Email.
  - Phone.
  - Message.
- Submit button.
- Field-specific validation.
- Field-specific error messages.
- Red invalid-field state.
- Green valid-field state.
- Green success message.
- Success fade-in animation.
- Brief disabled submit state.
- Automatic form reset after successful submission.
- Success message hidden after 3 seconds.
- Alert showing submitted data.
- README documentation.
- Unit tests for validation logic.
- Integration tests for DOM behavior.
- E2E tests for browser behavior.
- JSDoc for JavaScript functions.
- Basic SEO metadata.

### 5.2 Out of Scope

- Backend server.
- Real email delivery.
- Database persistence.
- CAPTCHA.
- Authentication.
- Production-grade anti-spam controls.
- External runtime framework.
- Real API submission.

## 6. Assumptions

| ID | Assumption |
| --- | --- |
| A-001 | The project runs directly in a browser or through a local static server. |
| A-002 | All validation is client-side. |
| A-003 | The submitted-data alert is temporary and exists only for the assignment. |
| A-004 | Phone validation follows the assignment's initial per-field rule from Step 3, including length limits and the declared base regex. |
| A-005 | Test tooling may use JavaScript dev dependencies, but the application itself remains plain HTML, CSS, and JavaScript. |

## 7. Functional Requirements

### 7.1 Page and Form

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-001 | The page must include a main heading with the text `Contact Us`. | The page displays a visible `Contact Us` heading. |
| FR-002 | The form must include a Full Name field. | The field is labeled and uses `input type="text"`. |
| FR-003 | The form must include an Email field. | The field is labeled and uses `input type="email"`. |
| FR-004 | The form must include a Phone field. | The field is labeled and uses `input type="tel"`. |
| FR-005 | The form must include a Message field. | The field is labeled and uses `textarea`. |
| FR-006 | The form must include a Submit button. | The button is visible and submits the form through JavaScript handling. |
| FR-007 | Each field must include a placeholder. | Placeholder text appears when the field is empty. |

### 7.2 Validation

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-008 | Full Name is required. | Empty name displays a field-specific error. |
| FR-009 | Full Name length must be 2-30 characters. | Names shorter than 2 or longer than 30 characters fail. |
| FR-010 | Full Name must match `^[a-zA-Zא-ת .-]+$`. | Digits and unsupported symbols fail. |
| FR-011 | Email is required. | Empty email displays a field-specific error. |
| FR-012 | Email must match `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`. | Invalid email values fail. |
| FR-013 | Phone is required. | Empty phone displays a field-specific error. |
| FR-014 | Phone length must be 8-15 characters after trimming. | Values shorter than 8 or longer than 15 characters fail. |
| FR-015 | Phone must match `^\+?[1-9]\d{1,14}$`. | Letters, spaces, unsupported symbols, local numbers starting with `0`, and misplaced `+` fail. |
| FR-016 | Message is required. | Empty message displays a field-specific error. |
| FR-017 | Message must be at least 10 characters after trimming. | Short messages fail. |
| FR-018 | Validation must run on submit. | Clicking Submit validates all fields. |
| FR-019 | Validation must run when leaving a field. | Tabbing or blurring out of a field validates that field. |

### 7.3 Feedback and UX

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-020 | Invalid fields must show a red error message below the field. | Each invalid field shows its own error near the field. |
| FR-021 | Invalid fields must receive a red border. | Invalid fields have visible red border styling. |
| FR-022 | Valid fields must receive a green border. | Valid fields have visible green border styling. |
| FR-023 | A green success message must appear after valid submission. | Success message appears only after all fields are valid. |
| FR-024 | The success message must fade in. | CSS animation or transition is visible. |
| FR-025 | The Submit button must become disabled briefly while submitting. | Button is disabled and styled gray during the submit simulation. |
| FR-026 | The form must clear after successful submission. | All fields return to empty state. |
| FR-027 | Green borders must be removed after successful clearing. | Fields have neutral borders after reset. |
| FR-028 | Success message must hide after 3 seconds. | Success message disappears automatically. |
| FR-029 | An alert must display submitted data. | Alert includes name, email, phone, and message exactly as submitted. |

### 7.4 Documentation

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-030 | The project must include `README.md`. | README exists at project root. |
| FR-031 | README must explain what the project does. | README has a project overview. |
| FR-032 | README must explain how to run the project. | README includes browser and optional local server instructions. |
| FR-033 | README must list validations. | README documents validation rules. |
| FR-034 | README must include reflection answers. | README briefly answers the assignment reflection questions. |

### 7.5 Testing

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-035 | Unit tests must cover pure validation logic. | Tests pass for valid and invalid name, email, phone, and message values. |
| FR-036 | Integration tests must cover DOM validation behavior. | Tests verify error rendering, valid/invalid classes, and submit-state behavior. |
| FR-037 | E2E tests must cover real browser flows. | Tests validate invalid submission, valid submission, alert content, reset behavior, and success timeout. |

## 8. Non-Functional Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| NFR-001 | The app must use plain HTML, CSS, and JavaScript at runtime. | No React, Vue, Angular, jQuery, Bootstrap, or runtime framework. |
| NFR-002 | The UI must be readable and responsive. | Form is usable on desktop and mobile widths. |
| NFR-003 | The HTML must use semantic structure. | Page uses `main`, `form`, `label`, and proper heading hierarchy. |
| NFR-004 | The page must include basic SEO metadata. | `title`, `meta description`, `viewport`, and meaningful heading exist. |
| NFR-005 | The form must be accessible by keyboard. | All inputs can be reached and submitted via keyboard. |
| NFR-006 | Error messages must be accessible. | Inputs reference error elements through `aria-describedby` or equivalent. |
| NFR-007 | JavaScript must include proper JSDoc. | Public/helper functions include `@param` and `@returns` where relevant. |
| NFR-008 | Code must be beginner-readable. | Code uses clear names, small functions, and comments only where helpful. |

## 9. Resolved Requirement Conflict

The assignment contains two phone-rule variants:

| Source Area | Phone Rule |
| --- | --- |
| Step 3 prompt | Required, min 8, max 15 characters, base regex `^\+?[1-9]\d{1,14}$`. |
| Final Validation Rules table | Numbers only, 9-10 digits. |

Implementation must follow the **Step 3 initial per-field rule** because the
user explicitly requested the initially declared rules.

Final phone rule:

```text
Required.
8-15 characters after trimming.
Must match /^\+?[1-9]\d{1,14}$/.
```

Note: this declared regex rejects local numbers starting with `0`, such as
`0541234567`. Use an international-style value such as `+972541234567` when
testing against this rule.

## 10. Definition of Done

The project is complete when:

- The page opens in a browser without console errors.
- All required form fields exist and are labeled.
- All validation rules pass and fail correctly.
- Errors are field-specific and displayed near the correct fields.
- Invalid fields receive red borders.
- Valid fields receive green borders.
- Success message appears in green and fades in.
- Submit button is briefly disabled and gray.
- Alert displays submitted data after valid submission.
- Form clears after successful submission.
- Success message hides after 3 seconds.
- README explains usage, validation, and learning.
- Unit, integration, and E2E tests pass.
- JavaScript functions have JSDoc.
- Git repository can be initialized and committed cleanly.
