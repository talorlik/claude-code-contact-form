# Prompt 07: Submitted Data Popup

Use this prompt with Claude Code.

```text
Add the submitted-details popup for successful submissions.

Requirements:
1. Implement showSubmissionPopup(formData).
2. The popup must display:
   - Name
   - Email
   - Phone
   - Message
3. Implement hideSubmissionPopup().
4. The popup must use the values submitted by the user before the form is cleared.
5. The popup must appear only after all fields pass validation.
6. The popup must not appear for invalid submissions.
7. Add close behavior:
   - clicking the X button closes the popup
   - clicking the green halo outside the popup card closes the popup
   - pressing Escape closes the popup
8. Focus the X button when the popup opens.
9. Use textContent when writing submitted values into the popup.
10. Do not log the submitted data to the console.
11. Do not use window.alert().
12. Keep the popup local-only; a real site would pair this UI with secure backend submission.

Expected popup content:

Message Sent

Thanks! Your message has been received.

Name: Taylor Smith
Email: taylor@example.com
Phone: +972 541234567
Message: I would like more information.

After implementation, explain where the popup is called in the submit flow.
```
