# Prompt 03: CSS Layout and Responsive Design

Use this prompt with Claude Code.

```text
Implement css/styles.css for the contact-form assignment.

Requirements:
1. Use plain CSS only.
2. Add a basic reset using box-sizing: border-box.
3. Create a clean, centered page layout.
4. Make the form container readable and visually balanced.
5. Style:
   - body
   - main container
   - form/card container
   - h1
   - intro paragraph
   - form groups
   - labels
   - inputs
   - textarea
   - phone input group
   - country picker trigger, popover, search input, and option list
   - submit button
   - error messages
   - submitted-details popup
6. Add responsive behavior for mobile screens.
7. Add these validation classes:
   - .is-valid: green border
   - .is-invalid: red border
8. Add .error-message styling:
   - red text
   - small readable size
   - spacing from field
9. Add country-picker styling:
   - .phone-input-group draws one shared border around trigger + national input
   - .country-trigger shows flag, dial code, and caret
   - .country-popover is positioned below the phone field and hidden by [hidden]
   - .country-search is a styled search input
   - .country-list is scrollable
   - .country-option supports hover, active, and selected states
10. Add submitted-details popup styling:
   - .submission-popup fixed overlay
   - light transparent green halo outside the card
   - hidden by default
   - centered white popup card
   - readable submitted-detail rows
   - X close button styling
11. Add .submission-popup.is-visible:
   - visible
   - use a fade-in animation
12. Add keyframes for the popup fade-in animation.
13. Add disabled/submitting button styling:
   - button:disabled
   - .submit-button.is-submitting
   - gray visual state
14. Keep the design beginner-friendly and not over-engineered.
15. Do not use external CSS libraries.

After implementation, list the classes that JavaScript should toggle.
```
