import { describe, it, expect } from "vitest";
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateFormData,
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
  it("accepts the minimum-length numeric value (8 digits)", () => {
    expect(validatePhone("12345678").isValid).toBe(true);
  });

  it("accepts an international-style value with a leading +", () => {
    expect(validatePhone("+972541234567").isValid).toBe(true);
  });

  it("accepts an international-style value without the leading +", () => {
    expect(validatePhone("972541234567").isValid).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validatePhone("  +972541234567  ").isValid).toBe(true);
  });

  it("rejects an empty value", () => {
    const result = validatePhone("");
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/required/i);
  });

  it("rejects values containing letters", () => {
    expect(validatePhone("054abc4567").isValid).toBe(false);
  });

  it("rejects values containing unsupported symbols", () => {
    expect(validatePhone("+972-541-234567").isValid).toBe(false);
  });

  it("rejects values with internal spaces", () => {
    expect(validatePhone("972 541 234567").isValid).toBe(false);
  });

  it("rejects local numbers starting with 0", () => {
    // Spec explicitly forbids this since the regex starts with [1-9].
    expect(validatePhone("0541234567").isValid).toBe(false);
  });

  it("rejects a misplaced + (not at start)", () => {
    expect(validatePhone("972+541234567").isValid).toBe(false);
  });

  it("rejects values shorter than 8 characters", () => {
    expect(validatePhone("1234567").isValid).toBe(false);
  });

  it("rejects values longer than 15 characters", () => {
    expect(validatePhone("+97254123456789").isValid).toBe(false);
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
      phone: "+972541234567",
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
      phone: "+972541234567",
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
      phone: "+972541234567",
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
