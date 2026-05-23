# Prompt 08: Unit Tests

Use this prompt with Claude Code.

```text
Add unit tests for javascript/validation.js and javascript/countries.js.

Use Vitest.

Requirements:
1. Make sure package.json includes a working test:unit script.
2. Create tests/unit/validation.test.js and tests/unit/countries.test.js.
3. Test validateFullName:
   - valid English name
   - valid Hebrew name
   - valid hyphenated name
   - empty value fails
   - too-short value fails
   - too-long value fails
   - digits fail
   - unsupported symbols fail
4. Test validateEmail:
   - valid email passes
   - empty value fails
   - missing @ fails
   - missing domain fails
   - missing TLD fails
5. Test validatePhone:
   - valid concatenated phone passes, for example +972 541234567
   - valid short national number with one-digit dial code passes, for example +1 1234567
   - valid long number with four-digit dial code passes, for example +1234 12345678901
   - empty value fails
   - missing leading + fails
   - missing space between dial code and national number fails
   - missing national number fails
   - letters fail
   - extra internal spaces fail
   - national number starting with 0 fails
   - national number shorter than 4 digits fails
   - national number longer than 14 digits fails
   - dial code starting with 0 fails
6. Test stripLeadingZero:
   - removes exactly one leading 0
   - leaves values without leading 0 unchanged
   - turns two leading zeros into one leading zero
   - handles empty, null, and undefined values
7. Test validateMessage:
   - valid message passes
   - empty message fails
   - short message fails
   - whitespace-only message fails
8. Test validateFormData:
   - all valid values produce all valid results
   - multiple invalid values produce multiple invalid results
9. Test countries.js with a small deterministic fixture:
   - loadCountries fetches once and caches the result
   - loadCountries rejects when fetch returns non-ok
   - getCountries returns cache and throws before load
   - findByIso2 is case-insensitive
   - searchCountries returns all countries for empty query
   - searchCountries ranks exact ISO2 first
   - searchCountries finds by ISO3, full name, and dial code
   - searchCountries matches dial code with or without leading +
   - searchCountries returns an empty array for no match
   - _resetForTests can seed and clear the cache
10. Keep tests readable and explicit.
11. Do not change validation rules to make tests pass. Fix code only if it violates the spec.

After implementation, provide the command to run unit tests.
```
