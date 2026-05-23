# Prompt 12: Final Review

Use this prompt with Claude Code.

```text
Perform a final review of the contact-form project against the assignment, PRD, and technical specification.

Check these areas:

1. Project structure:
   - docs/
   - docs/assignment/
   - docs/planning/
   - docs/prompts/
   - images/
   - css/
   - javascript/
   - index.html
   - README.md
   - tests if implemented

2. HTML:
   - Contact Us heading exists
   - Full Name field exists and is labeled
   - Email field exists and is labeled
   - Phone country picker, national-number input, and hidden submitted input exist
   - Country popover search and list elements exist
   - Message field exists and is labeled
   - Submit button exists
   - SEO metadata exists
   - accessibility attributes exist

3. CSS:
   - clean readable layout
   - responsive layout
   - red error messages
   - red invalid borders
   - green valid borders
   - country picker styling
   - green submitted-details popup
   - fade-in animation
   - gray disabled button state

4. JavaScript validation:
   - Full Name: required, 2-30 chars, regex /^[a-zA-Zא-ת .-]+$/
   - Email: required, regex /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
   - Phone: required, format +<dialCode> <nationalNumber>, regex /^\+[1-9]\d{0,3} [1-9]\d{3,13}$/
   - stripLeadingZero removes exactly one leading 0
   - Message: required, at least 10 chars
   - submit validation works
   - blur validation works
   - hidden #phone mirrors selected country plus visible national number
   - country picker loads data/countries.json and searches by ISO/name/dial code

5. Success behavior:
   - valid submit shows the submitted-details popup
   - popup fades in
   - button disables briefly
   - popup displays submitted data
   - form clears
   - country picker resets to Israel
   - validation borders reset
   - popup closes from the X button
   - popup closes when clicking outside the popup card
   - alert is not used

6. Tests:
   - unit tests pass
   - integration tests pass
   - e2e tests pass

7. JSDoc:
   - reusable validation and DOM functions have useful JSDoc

8. README:
   - explains project purpose
   - explains how to run
   - explains validations
   - includes reflection answers

If you find issues, fix them.
Then print:
- Summary of changes
- Remaining known limitations, if any
- Commands to run the app and tests
- Git commands to commit the result
```
