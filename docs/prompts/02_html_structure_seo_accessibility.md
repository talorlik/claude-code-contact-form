# Prompt 02: HTML Structure, SEO, and Accessibility

Use this prompt with Claude Code.

```text
Implement the initial index.html for a beginner contact-form assignment.

Use the existing project structure.

Requirements:
1. Use valid HTML5.
2. Add these SEO and document metadata fields:
   - charset UTF-8
   - viewport
   - title: "Contact Us | Contact Form"
   - meta description explaining that this is a beginner-friendly contact form with client-side validation
3. Link css/styles.css.
4. Load javascript/main.js at the end of the body using type="module".
5. Use semantic HTML:
   - main
   - section or article container
   - h1 with exact text: "Contact Us"
   - short introductory paragraph
6. Create a form with id="contactForm" and novalidate.
7. Add these fields:
   - Full Name: input type="text", id="fullName", name="fullName"
   - Email: input type="email", id="email", name="email"
   - Phone: input type="tel", id="phone", name="phone"
   - Message: textarea, id="message", name="message"
8. Add a Submit button.
9. Every field must have:
   - a visible label
   - a placeholder
   - an error container below the field
   - aria-describedby referencing the error container
   - initial aria-invalid="false"
10. Add a success-message element with id="successMessage", role="status", and aria-live="polite".
11. Use clear class names that will be easy to style later.
12. Do not implement JavaScript logic in the HTML.
13. Do not use inline styles.

Return the full index.html content and explain the structure briefly.
```
