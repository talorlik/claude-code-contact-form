# Prompt 04: Pure Validation Core

Use this prompt with Claude Code.

```text
Implement javascript/validation.js with pure validation logic.

Important:
- This file must not access the DOM.
- This file must export reusable functions for tests and for main.js.
- Add proper JSDoc for every exported function.
- Add a JSDoc typedef named ValidationResult.

Validation rules:
1. Full name:
   - Trim whitespace before validation.
   - Required.
   - Minimum length: 2.
   - Maximum length: 30.
   - Must match: /^[a-zA-Zא-ת .-]+$/
2. Email:
   - Trim whitespace before validation.
   - Required.
   - Must match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
3. Phone:
   - Trim whitespace before validation.
   - Required.
   - Minimum length: 8 characters.
   - Maximum length: 15 characters.
   - Must match: /^\+?[1-9]\d{1,14}$/
   - This rule allows an optional leading +.
   - This rule does not allow spaces, letters, symbols other than a leading +, or local numbers starting with 0.
4. Message:
   - Trim whitespace before validation.
   - Required.
   - Minimum length: 10.

Implement and export:
- validateFullName(value)
- validateEmail(value)
- validatePhone(value)
- validateMessage(value)
- validateFormData(formData)

Return format for single-field validators:
{
  isValid: boolean,
  message: string
}

validateFormData must return:
{
  fullName: ValidationResult,
  email: ValidationResult,
  phone: ValidationResult,
  message: ValidationResult
}

Error messages must be specific and beginner-readable.

Do not implement UI behavior in this file.
```
