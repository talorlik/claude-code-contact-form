# Assignment 2: Build a Contact Form With Data Validation

In this assignment, you will build a small contact form using HTML, CSS,
and JavaScript. You will also practice using VS Code (Cursor in my case) and
Claude Code as development tools while learning how to validate user input in
the browser.

By the end of the assignment, you should have a working contact form that
checks the user's input, shows clear error messages, confirms successful
submissions, and includes short project documentation.

## Table of Contents

- [Assignment Summary](#assignment-summary)
- [Learning Objectives](#learning-objectives)
- [What You Will Build](#what-you-will-build)
- [Prerequisites](#prerequisites)
- [Expected Project Structure](#expected-project-structure)
- [Step 1: Prepare Environment](#step-1-prepare-environment)
- [Step 2: Create Basic Form](#step-2-create-basic-form)
- [Step 3: Add Validation](#step-3-add-validation)
- [Step 4: Improve UX](#step-4-improve-ux)
- [Step 5: Clear Form](#step-5-clear-form)
- [Step 6: Add Test Alert](#step-6-add-test-alert)
- [Step 7: Document Project](#step-7-document-project)
- [Step 8: Save With Git](#step-8-save-with-git)
- [Validation Rules](#validation-rules)
- [Final Checklist](#final-checklist)
- [Submission Requirements](#submission-requirements)
- [Grading Rubric](#grading-rubric)
- [Reflection Questions](#reflection-questions)

## Assignment Summary

| Item | Details |
| ---- | ---- |
| Estimated Time | 20-25 minutes |
| Difficulty | Beginner |
| Main Tools | VS Code (Cursor), Claude Code, a web browser |
| Main Skills | HTML forms, CSS styling, JavaScript validation |
| Final Output | A working contact form and a `README.md` |

## Learning Objectives

After completing this assignment, you should be able to:

- Create a basic HTML form with common input fields.
- Style a simple page using embedded CSS.
- Use JavaScript to validate form input before submission.
- Display field-specific error messages.
- Give visual feedback for valid and invalid fields.
- Use Claude Code to request changes, test results, and improve code.
- Document what your project does and how to run it.

## What You Will Build

You will build a contact form with the following fields:

- Full name, required.
- Email address, required and checked for a valid email format.
- Phone number, required and limited to numbers only.
- Message, required and at least 10 characters long.
- Submit button.

The form must also include:

- Red error messages for invalid fields.
- A green success message after a valid submission.
- Red borders on invalid fields.
- Green borders on valid fields.
- A short success animation.
- Automatic form clearing after successful submission.
- A test alert that displays the submitted data.

## Prerequisites

Before starting, make sure you have:

- VS Code (Cursor in my case) installed.
- Claude Code available in your development environment.
- A browser such as Chrome, Edge, Safari, or Firefox, Commet (in my case).
- Optional: the Live Server extension for VS Code (Cursor).

You do not need a backend server for this assignment. Everything will run in
the browser.

## Expected Project Structure

Create a project folder named `claude-code-contact-form`. By the end of the assignment,
your folder should contain (at a minimum):

```text
claude-code-contact-form/
  docs/
  images/
  css/
  javascript/
  index.html
  README.md
```

## Step 1: Prepare Environment

1. Open VS Code (Cursor).
2. Create and open a new folder named `contact-form`.
3. Open the VS Code (Cursor) terminal:

   ```text
   Terminal > New Terminal
   ```

4. Open Claude Code in the project folder.

> [!TIP]
> If you are not sure Claude Code is working in the correct folder, ask it to
> list the current files. At the beginning, the folder should be empty.

## Step 2: Create Basic Form

Ask Claude Code to create the first version of the form.

Use this prompt:

```text
Create an index.html file with a contact form that includes:

- A heading: "Contact Us"
- A "Full Name" field using input type text
- An "Email" field using input type email
- A "Phone" field using input type tel
- A "Message" field using textarea
- A "Submit" button

Use a clean design with CSS.
```

After Claude creates the file:

1. Open `index.html` in your browser.
2. Use Live Server, or drag the file into the browser.
3. Fill in the form once to confirm that it displays correctly.
4. Check that the page has spacing, labels, and a readable layout.

## Step 3: Add Validation

Next, ask Claude Code to add JavaScript validation.

Use this prompt:

```text
Add JavaScript that validates the fields when clicking "Submit" or tabbing between fields:

1. Check that the full name is not empty. Has min 2 and max 30 characters. Base regex `^[a-zA-Zא-ת .-]+$`
2. Check that the email is not empty. Regex `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
3. Check that the phone number is not empty. Has min 8 and max 15 charcters. Base regex `^\+?[1-9]\d{1,14}$`
4. Check that the message is at least 10 characters long.

If there is an error, display a red error message under the relevant field.
If everything is valid, display a green success message.
```

Test the form with invalid input:

- Empty name.
- Email without `@`.
- Phone number with letters.
- Phone number with fewer than 9 digits.
- Message shorter than 10 characters.

Then test the form with valid input:

- Name: `Taylor Smith`
- Email: `taylor@example.com`
- Phone: `0541234567`
- Message: `I would like more information.`

## Step 4: Improve UX

Ask Claude Code to improve the form feedback and interaction.

Use this prompt:

```text
Improve the form:

1. Add a placeholder to each field.
2. Invalid fields should get a red border.
3. Valid fields should get a green border.
4. The button should change to gray while submitting and become disabled.
5. Add a fade-in animation to the success message.
```

After the changes are complete:

- Submit the form with invalid values and check the red borders.
- Submit the form with valid values and check the green borders.
- Confirm that placeholders appear inside empty fields.
- Confirm that the success message is animated.

## Step 5: Clear Form

Ask Claude Code to reset the form after a successful submission.

Use this prompt:

```text
After a successful submission:

1. Clear all fields and return them to empty.
2. Remove the green borders.
3. Show the success message for 3 seconds and then hide it.
```

Submit valid data and confirm that:

- The fields become empty.
- The success message appears.
- The success message disappears after 3 seconds.
- The form is ready for a new submission.

## Step 6: Add Test Alert

For this beginner assignment, add a temporary alert so you can see the data
that was submitted.

Use this prompt:

```text
Add an alert that displays the submitted data:

- Name
- Email
- Phone
- Message

This will allow me to see directly what was submitted.
```

Submit valid data and confirm that the alert shows the same values you typed
into the form.

> [!NOTE]
> In real production websites, form data is usually sent to a server instead
> of shown in an alert. The alert is only for this exercise.

## Step 7: Document Project

Ask Claude Code to create a short project README.

Use this prompt:

```text
Create a README.md file that explains:

- What the project does
- How to run it
- Which validations are performed
- What I learned
```

The `README.md` should be written clearly enough that another beginner can
open the project and understand how to use it.

## Step 8: Save With Git

If your project is not already a Git repository, initialize it:

```bash
git init
```

Then save your work:

```bash
git add .
git commit -m "Claude Code generated contact form with validation"
```

Run the commands one at a time so you can see whether each command succeeds.

## Validation Rules

Your finished form must follow these validation rules:

| Field | Requirement | Example Valid Value |
| ---- | ---- | ---- |
| Full Name | See rules above | `Taylor Smith` |
| Email | See rules above | `taylor@example.com` |
| Phone | See rules above | `0541234567` |
| Message | See rules above | `Hello, I need help.` |

Each invalid field should show a specific error message. For example, if the
phone number contains letters, the message should explain that the phone field
can contain numbers only.

## Final Checklist

Before submitting, confirm that:

- The page opens in a browser without errors.
- The form has a clean, readable design.
- Full name validation works.
- Email validation works.
- Phone validation works.
- Message validation works.
- Error messages appear in red.
- Invalid fields receive a red border.
- Valid fields receive a green border.
- A green success message appears after valid submission.
- The success message fades in.
- The button is disabled briefly while submitting.
- The form clears after a successful submission.
- The success message disappears after 3 seconds.
- The submitted data appears in an alert.
- `README.md` explains the project clearly.
- The project has been saved with Git.

## Submission Requirements

Submit the following:

- The `claude-code-contact-form` project folder.
- A screenshot of the form before and after a successful submission.
- Optional: a screenshot showing validation errors.

## Grading Rubric

| Category | Excellent | Needs Improvement |
| ---- | ---- | ---- |
| Form Structure | All required fields are present and labeled clearly. | Fields are missing or hard to understand. |
| Styling | The form is clean, readable, and consistent. | Styling is incomplete or difficult to read. |
| Validation | All validation rules work correctly. | Some fields do not validate correctly. |
| Error Feedback | Errors are specific and shown near the correct fields. | Errors are missing, unclear, or not field-specific. |
| Success Behavior | Success message, alert, clearing, and timing all work. | Successful submission behavior is incomplete. |
| Documentation | `README.md` explains purpose, usage, validation, and learning. | Documentation is missing or too vague. |

## Reflection Questions

Answer these briefly in your `README.md` or in a separate note:

- Which validation rule was easiest to understand?
- Which validation rule was hardest to test?
- How did Claude Code help you move from one version to the next?
- What would you improve if this form were used on a real website?
