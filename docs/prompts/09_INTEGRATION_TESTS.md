# Prompt 09: Integration Tests

Use this prompt with Claude Code.

```text
Add integration tests for the contact form DOM behavior.

Use Vitest with jsdom.

Requirements:
1. Make sure package.json includes a working test:integration script.
2. Configure Vitest so integration tests use the jsdom environment.
3. Create tests/integration/form.integration.test.js.
4. The test setup must load the same DOM shape used by index.html, then reset modules before importing main.js.
5. Stub fetch so loadCountries resolves to a deterministic country fixture.
6. Spy on window.alert to verify it is not called.
7. Test country picker boot:
   - default country is Israel in the trigger
   - hidden #phone is seeded with +972 plus a trailing space
   - trigger click opens the popover and focuses search
   - search filters countries by ISO/name/dial code
   - selecting a country updates the trigger and hidden #phone
8. Test hidden #phone recomputation:
   - one leading 0 in the national number is stripped
   - two leading zeros leave one 0 so validation can fail
   - changing country recomputes hidden #phone with the current national number
9. Test that blurring an invalid field:
   - shows the correct error message
   - adds .is-invalid
   - sets aria-invalid="true"
10. Test that blurring a valid field:
   - clears the error message
   - adds .is-valid
   - sets aria-invalid="false"
11. Test invalid form submission:
   - shows field-specific errors
   - does not call alert
   - does not show the submitted-details popup
   - does not clear entered invalid values
12. Test valid form submission:
   - does not call alert
   - shows the submitted-details popup
   - renders submitted name, email, phone, and message in the popup
   - clears all fields
   - resets country picker to Israel
   - resets hidden #phone to +972 plus a trailing space
   - removes validation borders after reset
13. Test popup close behavior:
   - X button closes the popup
   - clicking the halo outside the card closes the popup
   - clicking inside the card keeps the popup open
14. Keep tests deterministic.
15. Do not use Playwright here. Browser-level tests are handled separately.

After implementation, provide the command to run integration tests.
```
