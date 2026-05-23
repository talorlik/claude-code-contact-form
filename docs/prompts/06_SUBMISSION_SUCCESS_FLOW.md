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
2. Implement resetFormState():
   - clear all fields
   - remove .is-valid and .is-invalid from all fields
   - clear all error messages
   - reset aria-invalid to "false"
   - reset the country picker to the Israel default
   - recompute hidden #phone so it becomes "+972 "
3. Update the submit handler:
   - prevent default
   - validate all fields
   - if invalid, stop
   - if valid, capture the submitted data before resetting
   - set submitting state to true briefly
   - leave a placeholder call/comment for the submitted-details popup
   - reset the form
   - set submitting state back to false
4. Invalid submissions must not clear the form.
5. Invalid submissions must not show the submitted-details popup.

Do not add an alert in this step. The submitted-details popup is handled in the
next prompt.
```
