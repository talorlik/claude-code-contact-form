# Prompt 08: Unit Tests

Use this prompt with Claude Code.

```text
Add unit tests for javascript/validation.js.

Use Vitest.

Requirements:
1. Make sure package.json includes a working test:unit script.
2. Create tests/unit/validation.test.js.
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
   - valid minimum-length phone passes, for example 12345678
   - valid international-style phone with leading + passes, for example +972541234567
   - valid phone without leading + passes, for example 972541234567
   - empty value fails
   - letters fail
   - unsupported symbols fail
   - spaces fail
   - local number starting with 0 fails because the declared regex starts with [1-9]
   - misplaced + fails
   - too-short value fails
   - too-long value fails
6. Test validateMessage:
   - valid message passes
   - empty message fails
   - short message fails
   - whitespace-only message fails
7. Test validateFormData:
   - all valid values produce all valid results
   - multiple invalid values produce multiple invalid results
8. Keep tests readable and explicit.
9. Do not change validation rules to make tests pass. Fix code only if it violates the spec.

After implementation, provide the command to run unit tests.
```
