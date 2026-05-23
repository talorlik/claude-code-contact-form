# Prompt 10: E2E Tests

Use this prompt with Claude Code.

```text
Add Playwright E2E tests for the contact-form assignment.

Requirements:
1. Make sure package.json includes a working test:e2e script.
2. Configure playwright.config.js to serve the static project locally before tests.
3. Create tests/e2e/contact-form.spec.js.
4. Test page load:
   - page opens
   - h1 "Contact Us" is visible
5. Test invalid submission:
   - click Submit with empty fields
   - verify all required error messages appear
   - verify invalid fields have invalid styling
6. Test phone-specific invalid input:
   - enter letters in the phone field
   - submit or blur
   - verify phone-specific error appears
7. Test valid submission:
   - fill:
     - Full Name: Taylor Smith
     - Email: taylor@example.com
     - Phone: +972541234567
     - Message: I would like more information.
   - listen for the alert dialog
   - submit the form
   - verify alert text contains all submitted values
   - accept the alert
   - verify fields are cleared
   - verify success message appears
   - verify success message disappears after 3 seconds
8. Keep selectors stable and based on labels, roles, or IDs.
9. Do not remove assignment behavior to simplify tests.

After implementation, provide the command to run E2E tests.
```
