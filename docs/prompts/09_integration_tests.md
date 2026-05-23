# Prompt 09: Integration Tests

Use this prompt with Claude Code.

```text
Add integration tests for the contact form DOM behavior.

Use Vitest with jsdom.

Requirements:
1. Make sure package.json includes a working test:integration script.
2. Configure Vitest so integration tests use the jsdom environment.
3. Create tests/integration/form.integration.test.js.
4. The test setup must load or construct the same DOM shape used by index.html.
5. Mock window.alert.
6. Use fake timers where needed for the 3-second success-message timeout.
7. Test that blurring an invalid field:
   - shows the correct error message
   - adds .is-invalid
   - sets aria-invalid="true"
8. Test that blurring a valid field:
   - clears the error message
   - adds .is-valid
   - sets aria-invalid="false"
9. Test invalid form submission:
   - shows field-specific errors
   - does not call alert
   - does not show success
   - does not clear entered invalid values
10. Test valid form submission:
   - calls alert with submitted data
   - shows success
   - clears all fields
   - removes validation borders after reset
   - hides success message after 3 seconds
11. Keep tests deterministic.
12. Do not use Playwright here. Browser-level tests are handled separately.

After implementation, provide the command to run integration tests.
```
