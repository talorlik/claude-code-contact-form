# Prompt 05: DOM Validation Integration

Use this prompt with Claude Code.

```text
Implement javascript/main.js to connect the validation functions to the contact form.

Use imports from javascript/validation.js.

Requirements:
1. Select these DOM elements:
   - contactForm
   - fullName
   - email
   - phone
   - message
   - fullNameError
   - emailError
   - phoneError
   - messageError
   - successMessage
   - submit button
2. Implement getFormData().
3. Implement renderFieldState(fieldName, result):
   - write the error message into the correct error element
   - add .is-invalid when invalid
   - add .is-valid when valid
   - remove the opposite state class
   - update aria-invalid
4. Implement validateSingleField(fieldName).
5. Add blur event listeners to validate a field when the user tabs/clicks away from it.
6. Implement validateAllFields():
   - read current form data
   - validate all fields
   - render all field states
   - return whether the whole form is valid
7. Add a submit event listener:
   - prevent default submit behavior
   - validate all fields
   - if invalid, do not clear the form and do not show success
   - if valid, leave a placeholder comment for the success flow, which will be implemented in the next prompt
8. Keep functions small and readable.
9. Add JSDoc to reusable functions.
10. Do not use inline JavaScript in index.html.
11. Do not use external libraries.

After implementation, summarize the submit and blur behavior.
```
