# Prompt 06: Submission Success Flow

Use this prompt with Claude Code.

```text
Update javascript/main.js and css/styles.css where needed to implement the successful-submission flow.

Requirements:
1. Implement setSubmittingState(isSubmitting):
   - when true, disable the submit button
   - add .is-submitting
   - optionally change the button text to "Submitting..."
   - when false, restore the button
2. Implement showSuccessMessage():
   - show the success message
   - add .is-visible
   - set clear success text
3. Implement hideSuccessMessage():
   - hide the success message
   - remove .is-visible
4. Implement resetFormState():
   - clear all fields
   - remove .is-valid and .is-invalid from all fields
   - clear all error messages
   - reset aria-invalid to "false"
5. Update the submit handler:
   - prevent default
   - validate all fields
   - if invalid, stop
   - if valid, capture the submitted data before resetting
   - set submitting state to true briefly
   - show success message
   - reset the form
   - set submitting state back to false
   - hide success message after 3 seconds
6. Invalid submissions must not clear the form.
7. Invalid submissions must not show the success message.
8. Make sure the success message fade-in animation still works.

Do not add the alert in this step. That is handled in the next prompt.
```
