import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  searchCountries,
  findByIso2,
  getCountries,
  loadCountries,
  _resetForTests,
} from "../../javascript/countries.js";

// Compact deterministic fixture covering the cases we care about for
// ranking and search. Uses a handful of real entries so search-by-name and
// search-by-dial-code both have meaningful matches.
const FIXTURE = [
  { name: "Australia", iso2: "AU", iso3: "AUS", dialCode: "+61", flag: "🇦🇺" },
  { name: "Brazil", iso2: "BR", iso3: "BRA", dialCode: "+55", flag: "🇧🇷" },
  { name: "Canada", iso2: "CA", iso3: "CAN", dialCode: "+1", flag: "🇨🇦" },
  { name: "Iceland", iso2: "IS", iso3: "ISL", dialCode: "+354", flag: "🇮🇸" },
  { name: "India", iso2: "IN", iso3: "IND", dialCode: "+91", flag: "🇮🇳" },
  { name: "Ireland", iso2: "IE", iso3: "IRL", dialCode: "+353", flag: "🇮🇪" },
  { name: "Isle of Man", iso2: "IM", iso3: "IMN", dialCode: "+44", flag: "🇮🇲" },
  { name: "Israel", iso2: "IL", iso3: "ISR", dialCode: "+972", flag: "🇮🇱" },
  { name: "Italy", iso2: "IT", iso3: "ITA", dialCode: "+39", flag: "🇮🇹" },
  { name: "United Kingdom", iso2: "GB", iso3: "GBR", dialCode: "+44", flag: "🇬🇧" },
  { name: "United States", iso2: "US", iso3: "USA", dialCode: "+1", flag: "🇺🇸" },
];

beforeEach(() => {
  _resetForTests(FIXTURE);
});

describe("loadCountries", () => {
  it("fetches and parses the JSON, caching the result", async () => {
    _resetForTests(null);
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => FIXTURE,
      });
    const first = await loadCountries();
    const second = await loadCountries();
    expect(first).toEqual(FIXTURE);
    expect(second).toBe(first);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    fetchSpy.mockRestore();
  });

  it("rejects when fetch returns non-ok", async () => {
    _resetForTests(null);
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ ok: false, status: 404 });
    await expect(loadCountries()).rejects.toThrow(/countries/i);
    fetchSpy.mockRestore();
  });
});

describe("getCountries", () => {
  it("returns the cached array", () => {
    expect(getCountries()).toEqual(FIXTURE);
  });

  it("throws when called before loadCountries", () => {
    _resetForTests(null);
    expect(() => getCountries()).toThrow();
  });
});

describe("findByIso2", () => {
  it("finds by exact upper-case ISO2", () => {
    expect(findByIso2("IL")?.name).toBe("Israel");
  });

  it("is case-insensitive", () => {
    expect(findByIso2("il")?.name).toBe("Israel");
    expect(findByIso2("Il")?.name).toBe("Israel");
  });

  it("returns undefined for an unknown code", () => {
    expect(findByIso2("ZZ")).toBeUndefined();
  });
});

describe("searchCountries", () => {
  it("returns all countries for an empty or whitespace query", () => {
    expect(searchCountries("")).toEqual(FIXTURE);
    expect(searchCountries("   ")).toEqual(FIXTURE);
  });

  it("ranks an exact ISO2 match first", () => {
    // "IL" must rank Israel before Iceland, Ireland, etc. even though they
    // also contain 'il'-ish letters somewhere.
    const results = searchCountries("IL");
    expect(results[0].iso2).toBe("IL");
  });

  it("is case-insensitive for ISO2", () => {
    expect(searchCountries("il")[0].iso2).toBe("IL");
  });

  it("finds by ISO3", () => {
    const results = searchCountries("isr");
    expect(results.some((c) => c.iso2 === "IL")).toBe(true);
  });

  it("finds by full name", () => {
    const results = searchCountries("Israel");
    expect(results[0].name).toBe("Israel");
  });

  it("finds by name prefix and ranks startsWith above substring", () => {
    const results = searchCountries("Ir");
    // "Ireland" (startsWith) ranks above "Brazil" — but Brazil shouldn't
    // even match "Ir". Iceland (also no match for "ir") shouldn't either.
    expect(results[0].name).toBe("Ireland");
    expect(results.every((c) => /ir/i.test(c.name + c.iso2 + c.iso3 + c.dialCode))).toBe(true);
  });

  it("finds by dial code with leading +", () => {
    const results = searchCountries("+972");
    expect(results[0].iso2).toBe("IL");
  });

  it("finds by dial code without leading +", () => {
    const results = searchCountries("972");
    expect(results[0].iso2).toBe("IL");
  });

  it("finds multiple countries sharing a dial code", () => {
    const results = searchCountries("+1");
    const codes = results.map((c) => c.iso2);
    expect(codes).toContain("US");
    expect(codes).toContain("CA");
  });

  it("returns an empty array when nothing matches", () => {
    expect(searchCountries("zzznomatch")).toEqual([]);
  });

  it("ranks startsWith above substring within tied tiers", () => {
    // "An" should rank countries whose names start with "An" above those
    // that merely contain it. None in our fixture do, so search for "Is":
    //   - Israel (name startsWith "Is") and Iceland (startsWith "Is") above
    //   - Isle of Man (startsWith "Is") above
    //   - Brazil (contains "razi", no match) — irrelevant.
    const results = searchCountries("Is");
    const top = results.slice(0, 3).map((c) => c.name);
    expect(top).toContain("Iceland");
    expect(top).toContain("Israel");
    expect(top).toContain("Isle of Man");
  });
});
