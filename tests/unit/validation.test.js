import { describe, it, expect } from "vitest";
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateFormData,
  stripLeadingZero,
} from "../../javascript/validation.js";

describe("validateFullName", () => {
  it("accepts a valid English name", () => {
    expect(validateFullName("Taylor Smith")).toEqual({
      isValid: true,
      message: "",
    });
  });

  it("accepts a valid Hebrew name", () => {
    expect(validateFullName("יוסי כהן").isValid).toBe(true);
  });

  it("accepts a hyphenated name", () => {
    expect(validateFullName("Anne-Marie Smith").isValid).toBe(true);
  });

  it("accepts names with a dot (initials)", () => {
    expect(validateFullName("J. Doe").isValid).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validateFullName("  Tal Orlik  ").isValid).toBe(true);
  });

  it("rejects an empty value", () => {
    const result = validateFullName("");
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/required/i);
  });

  it("rejects whitespace-only input", () => {
    expect(validateFullName("    ").isValid).toBe(false);
  });

  it("rejects a value that is too short", () => {
    const result = validateFullName("A");
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/2 and 30/);
  });

  it("rejects a value that is too long", () => {
    const result = validateFullName("A".repeat(31));
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/2 and 30/);
  });

  it("rejects values containing digits", () => {
    expect(validateFullName("John123").isValid).toBe(false);
  });

  it("rejects unsupported symbols", () => {
    expect(validateFullName("John@Smith").isValid).toBe(false);
    expect(validateFullName("John_Smith").isValid).toBe(false);
  });
});

describe("validateEmail", () => {
  it("accepts a well-formed email", () => {
    expect(validateEmail("taylor@example.com")).toEqual({
      isValid: true,
      message: "",
    });
  });

  it("accepts emails with subdomains and plus addressing", () => {
    expect(validateEmail("a.b+tag@mail.example.co").isValid).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validateEmail("  taylor@example.com  ").isValid).toBe(true);
  });

  it("rejects an empty value", () => {
    const result = validateEmail("");
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/required/i);
  });

  it("rejects a value missing @", () => {
    expect(validateEmail("taylor").isValid).toBe(false);
  });

  it("rejects a value missing the domain section", () => {
    expect(validateEmail("taylor@").isValid).toBe(false);
  });

  it("rejects a value missing the TLD", () => {
    expect(validateEmail("taylor@example").isValid).toBe(false);
  });

  it("rejects a TLD shorter than 2 characters", () => {
    expect(validateEmail("taylor@example.c").isValid).toBe(false);
  });
});

describe("validatePhone", () => {
  it("accepts a typical international value with dial code and national number", () => {
    expect(validatePhone("+972 541234567")).toEqual({
      isValid: true,
      message: "",
    });
  });

  it("accepts a short national number with a 1-digit dial code", () => {
    expect(validatePhone("+1 1234567").isValid).toBe(true);
  });

  it("accepts a long national number with a 4-digit dial code", () => {
    // Max 15 total digits per E.164 (4 in dial code + 11 in national portion).
    expect(validatePhone("+1234 12345678901").isValid).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validatePhone("  +972 541234567  ").isValid).toBe(true);
  });

  it("rejects an empty value", () => {
    const result = validatePhone("");
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/required/i);
  });

  it("rejects a value missing the leading +", () => {
    expect(validatePhone("972 541234567").isValid).toBe(false);
  });

  it("rejects a value missing the space between dial code and national number", () => {
    expect(validatePhone("+972541234567").isValid).toBe(false);
  });

  it("rejects a value missing the national number", () => {
    expect(validatePhone("+972 ").isValid).toBe(false);
  });

  it("rejects values containing letters", () => {
    expect(validatePhone("+972 054abc4567").isValid).toBe(false);
  });

  it("rejects values with extra internal spaces", () => {
    expect(validatePhone("+972 541 234567").isValid).toBe(false);
  });

  it("rejects national numbers starting with 0", () => {
    // The caller is expected to strip a single leading 0 BEFORE
    // concatenation. A 0 reaching validation means the user typed at
    // least two leading zeros, which is not a real phone-number pattern.
    expect(validatePhone("+972 0541234567").isValid).toBe(false);
  });

  it("rejects national numbers shorter than 4 digits", () => {
    expect(validatePhone("+1 123").isValid).toBe(false);
  });

  it("rejects national numbers longer than 14 digits", () => {
    expect(validatePhone("+1 123456789012345").isValid).toBe(false);
  });

  it("rejects a dial code with a leading 0", () => {
    expect(validatePhone("+0 1234567").isValid).toBe(false);
  });
});

describe("stripLeadingZero", () => {
  it("removes a single leading 0", () => {
    expect(stripLeadingZero("0541234567")).toBe("541234567");
  });

  it("leaves a value without a leading 0 unchanged", () => {
    expect(stripLeadingZero("541234567")).toBe("541234567");
  });

  it("removes exactly one 0 — two leading zeros become one", () => {
    // The user typed something unusual; we want validation to flag this,
    // not silently strip both zeros and accept it.
    expect(stripLeadingZero("00541234567")).toBe("0541234567");
  });

  it("returns an empty string unchanged", () => {
    expect(stripLeadingZero("")).toBe("");
  });

  it("returns a single 0 as an empty string", () => {
    expect(stripLeadingZero("0")).toBe("");
  });

  it("treats null/undefined as empty string", () => {
    expect(stripLeadingZero(null)).toBe("");
    expect(stripLeadingZero(undefined)).toBe("");
  });
});

describe("validateMessage", () => {
  it("accepts a 10-character message", () => {
    expect(validateMessage("1234567890").isValid).toBe(true);
  });

  it("accepts a typical message", () => {
    expect(validateMessage("I would like more information.").isValid).toBe(
      true
    );
  });

  it("rejects an empty value", () => {
    const result = validateMessage("");
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/required/i);
  });

  it("rejects a value shorter than 10 characters", () => {
    expect(validateMessage("Hi").isValid).toBe(false);
    expect(validateMessage("Need info").isValid).toBe(false);
  });

  it("rejects a whitespace-only message", () => {
    expect(validateMessage("            ").isValid).toBe(false);
  });
});

describe("validateFormData", () => {
  it("returns a result keyed by every field", () => {
    const result = validateFormData({
      fullName: "Taylor Smith",
      email: "taylor@example.com",
      phone: "+972 541234567",
      message: "I would like more information.",
    });
    expect(Object.keys(result).sort()).toEqual(
      ["email", "fullName", "message", "phone"].sort()
    );
  });

  it("reports every field valid for fully valid data", () => {
    const result = validateFormData({
      fullName: "Taylor Smith",
      email: "taylor@example.com",
      phone: "+972 541234567",
      message: "I would like more information.",
    });
    expect(result.fullName.isValid).toBe(true);
    expect(result.email.isValid).toBe(true);
    expect(result.phone.isValid).toBe(true);
    expect(result.message.isValid).toBe(true);
  });

  it("reports every invalid field for fully invalid data", () => {
    const result = validateFormData({
      fullName: "",
      email: "not-an-email",
      phone: "0541234567",
      message: "Hi",
    });
    expect(result.fullName.isValid).toBe(false);
    expect(result.email.isValid).toBe(false);
    expect(result.phone.isValid).toBe(false);
    expect(result.message.isValid).toBe(false);
  });

  it("reports a mix of valid and invalid fields", () => {
    const result = validateFormData({
      fullName: "Taylor Smith",
      email: "broken",
      phone: "+972 541234567",
      message: "short",
    });
    expect(result.fullName.isValid).toBe(true);
    expect(result.email.isValid).toBe(false);
    expect(result.phone.isValid).toBe(true);
    expect(result.message.isValid).toBe(false);
  });

  it("tolerates missing fields by treating them as empty", () => {
    const result = validateFormData({});
    expect(result.fullName.isValid).toBe(false);
    expect(result.email.isValid).toBe(false);
    expect(result.phone.isValid).toBe(false);
    expect(result.message.isValid).toBe(false);
  });
});
