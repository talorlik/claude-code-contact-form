# Prompt 11: README Documentation

Use this prompt with Claude Code.

```text
Create or update README.md for the contact-form assignment.

The README must be beginner-readable.

Include:
1. Project title.
2. Short overview of what the project does.
3. Screenshot placeholders:
   - Before successful submission
   - After successful submission
   - Optional validation errors
4. Project structure.
5. How to run:
   - Option 1: open index.html in a browser
   - Option 2: use VS Code Live Server
   - Option 3: use a local static server if package.json includes one
6. Validation rules table:
   - Full Name: required, 2-30 chars, allowed letters Hebrew/English, spaces, dot, hyphen
   - Email: required, valid email format
   - Phone: country picker supplies dial code, user types national number, one leading 0 is stripped, submitted format is +<dialCode> <nationalNumber>, regex /^\+[1-9]\d{0,3} [1-9]\d{3,13}$/
   - Message: required, at least 10 characters
7. UX behavior:
   - red error messages
   - red invalid borders
   - green valid borders
   - searchable country-code picker defaulting to Israel (+972)
   - green submitted-details popup
   - fade-in animation
   - disabled submit button while submitting
   - form clearing
   - popup displays submitted data
   - popup closes from the X button or outside click
   - form resets the country picker to Israel after successful submission
8. Testing:
   - how to run unit tests
   - how to run integration tests
   - how to run E2E tests
9. What I learned.
10. Reflection questions:
   - Which validation rule was easiest to understand?
   - Which validation rule was hardest to test?
   - How did Claude Code help you move from one version to the next?
   - What would you improve if this form were used on a real website?
11. Production note:
   - explain that the popup is local-only for this exercise
   - real websites usually send form data to a backend server

Keep the README concise but complete.
```
