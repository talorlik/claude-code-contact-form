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
5. Test country picker:
   - defaults to Israel and seeds hidden #phone with +972 plus a trailing space
   - opens from the trigger
   - searches by ISO code and selects with Enter
   - searches by full country name
6. Test invalid submission:
   - click Submit with empty fields
   - verify all required error messages appear
   - verify invalid fields have invalid styling
   - verify no alert dialog opens
7. Test phone-specific invalid input:
   - enter letters in the national-number input
   - submit or blur
   - verify phone-specific error appears
8. Test valid submission:
   - fill:
     - Full Name: Taylor Smith
     - Email: taylor@example.com
     - Phone national input: 0541234567
     - Message: I would like more information.
   - submit the form
   - verify no alert dialog opens
   - verify submitted-details popup is visible
   - verify popup contains all submitted values
   - verify popup shows Phone: +972 541234567
   - verify fields are cleared
   - verify the country picker resets to Israel
   - verify hidden #phone resets to +972 plus a trailing space
   - close the popup from the X button
9. Test popup outside-click close behavior.
10. Test changing country re-runs phone validation and recomputes hidden #phone.
11. Keep selectors stable and based on labels, roles, or IDs.
12. Do not remove assignment behavior to simplify tests.

After implementation, provide the command to run E2E tests.
```
