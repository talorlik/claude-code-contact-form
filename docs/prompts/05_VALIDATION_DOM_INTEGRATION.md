# Prompt 05: DOM Validation Integration

Use this prompt with Claude Code.

```text
Implement javascript/countryPicker.js and javascript/main.js to connect the
validation functions and country picker to the contact form.

Use imports from javascript/validation.js, javascript/countries.js, and
javascript/countryPicker.js.

Requirements:
1. Implement createCountryPicker(options) in javascript/countryPicker.js:
   - accepts pre-existing trigger, popover, search input, and list elements
   - renders flag, dial code, and caret in the trigger
   - renders country options with role="option" and data-iso2
   - filters with searchCountries(query)
   - supports click selection
   - supports keyboard open/select/navigation with Arrow keys, Home, End, Enter, Space, and Escape
   - closes when clicking outside the popover
   - returns { open, close, getSelected, setSelectedByIso2 }
2. In javascript/main.js, select these DOM elements:
   - contactForm
   - fullName
   - email
   - nationalNumber as the visible phone input
   - phone as the hidden submitted phone input
   - countryTrigger
   - countryPopover
   - countrySearch
   - countryList
   - message
   - fullNameError
   - emailError
   - phoneError
   - messageError
   - submissionPopup
   - submissionPopupClose
   - submit button
3. Implement getFormData():
   - reads fullName, email, hidden #phone, and message
4. Implement recomputeHiddenPhone():
   - strips exactly one leading 0 from the visible national number
   - concatenates selectedCountry.dialCode + " " + stripped national number
   - writes that value into hidden #phone
5. Implement renderFieldState(fieldName, result):
   - write the error message into the correct error element
   - add .is-invalid when invalid
   - add .is-valid when valid
   - remove the opposite state class
   - update aria-invalid
   - for phone, render state on the visible national-number input
6. Implement validateSingleField(fieldName):
   - for phone, recompute hidden #phone first and validate that concatenated value
7. Add blur event listeners to validate a field when the user tabs/clicks away from it.
8. Add an input listener on the national-number input to keep hidden #phone synced.
9. Implement validateAllFields():
   - read current form data
   - validate all fields
   - render all field states
   - return whether the whole form is valid
10. Add a submit event listener:
   - prevent default submit behavior
   - validate all fields
   - if invalid, do not clear the form and do not show the popup
   - if valid, leave a placeholder comment for the success popup flow, which will be implemented in later prompts
11. Boot the country picker:
   - load countries from data/countries.json
   - default to Israel (ISO2 "IL")
   - recompute hidden #phone on selection changes
   - re-run phone validation on selection changes
12. Add fallbackToPlainPhoneInput() for failed country loading:
   - make hidden #phone visible as type="tel"
   - hide country picker UI and national-number input
   - validate the user's full typed phone value directly
13. Keep functions small and readable.
14. Add JSDoc to reusable functions.
15. Do not use inline JavaScript in index.html.
16. Do not use external libraries.

After implementation, summarize the submit and blur behavior.
```
