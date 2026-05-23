# Prompt 04: Pure Validation and Country Utilities

Use this prompt with Claude Code.

```text
Implement javascript/validation.js with pure validation logic and
javascript/countries.js with pure country-data utilities.

Important:
- These files must not access the DOM.
- These files must export reusable functions for tests and for main.js.
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
   - Submitted format is "+<dialCode> <nationalNumber>".
   - Minimum length: 7 characters, for example "+1 1234".
   - Maximum length: 17 characters, for example "+1234 12345678901".
   - Must match: /^\+[1-9]\d{0,3} [1-9]\d{3,13}$/
   - Requires a leading + on the dial code.
   - Requires exactly one space between dial code and national number.
   - The dial code must be 1-4 digits and must not start with 0.
   - The national number must be 4-14 digits and must not start with 0.
   - Callers must strip exactly one leading 0 from the visible national-number input before concatenating.
4. Message:
   - Trim whitespace before validation.
   - Required.
   - Minimum length: 10.

Implement and export:
- constants for regexes and limits
- validateFullName(value)
- validateEmail(value)
- validatePhone(value)
- stripLeadingZero(value)
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

Country utilities:
1. Implement javascript/countries.js.
2. Define a Country JSDoc typedef with name, iso2, iso3, dialCode, and flag.
3. loadCountries() fetches ./data/countries.json, caches the parsed array, and deduplicates concurrent in-flight fetches.
4. getCountries() returns the cached array and throws if countries have not loaded.
5. findByIso2(code) returns a case-insensitive ISO2 match.
6. searchCountries(query):
   - returns all cached countries for empty or whitespace query
   - searches name, iso2, iso3, and dialCode
   - matches dial codes with or without a leading +
   - returns results ranked by exact iso2, then name startsWith, then dialCode startsWith, then substring
   - preserves source order within each tier
7. Add _resetForTests(seed) so unit tests can seed or clear the cache.

Do not implement UI behavior in these files.
```
