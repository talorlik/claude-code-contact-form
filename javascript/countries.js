/**
 * Country data loader and search utilities.
 *
 * Pure module: no DOM access. The country list is fetched once from
 * `data/countries.json` and cached at module scope; subsequent calls
 * reuse the cached array.
 *
 * @module countries
 */

/**
 * @typedef {Object} Country
 * @property {string} name - English common name (e.g., "Israel").
 * @property {string} iso2 - ISO 3166-1 alpha-2 code (e.g., "IL").
 * @property {string} iso3 - ISO 3166-1 alpha-3 code (e.g., "ISR").
 * @property {string} dialCode - International dial code with leading + (e.g., "+972").
 * @property {string} flag - Unicode regional-indicator flag emoji (e.g., "🇮🇱").
 */

const COUNTRIES_URL = "./data/countries.json";

/** @type {Country[] | null} */
let cache = null;
/** @type {Promise<Country[]> | null} */
let inflight = null;

/**
 * Resolves with the country list, fetching `data/countries.json` once and
 * caching the parsed result. Concurrent calls share the in-flight promise.
 *
 * @returns {Promise<Country[]>}
 */
export async function loadCountries() {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const res = await fetch(COUNTRIES_URL);
    if (!res.ok) {
      inflight = null;
      throw new Error(
        `Failed to load countries.json (HTTP ${res.status})`
      );
    }
    const data = await res.json();
    cache = data;
    inflight = null;
    return cache;
  })();
  return inflight;
}

/**
 * Returns the cached country array. Throws if `loadCountries` has not
 * resolved yet — callers should always await `loadCountries` once at boot
 * before using this.
 *
 * @returns {Country[]}
 */
export function getCountries() {
  if (!cache) {
    throw new Error("Countries not loaded yet. Call loadCountries() first.");
  }
  return cache;
}

/**
 * Looks up a country by ISO 3166-1 alpha-2 code, case-insensitively.
 *
 * @param {string} code
 * @returns {Country | undefined}
 */
export function findByIso2(code) {
  if (!cache) return undefined;
  const target = String(code ?? "").toUpperCase();
  return cache.find((c) => c.iso2 === target);
}

/**
 * Searches the country list across name, iso2, iso3, and dialCode.
 *
 * Empty/whitespace query returns the full list in its natural order.
 * Non-empty query returns matches ranked into tiers (stable within tier):
 *   1. exact iso2 match
 *   2. name startsWith query
 *   3. dialCode startsWith query (matching both "+972" and "972" forms)
 *   4. substring match anywhere across name/iso2/iso3/dialCode
 *
 * @param {string} query
 * @returns {Country[]}
 */
export function searchCountries(query) {
  if (!cache) return [];
  const q = String(query ?? "").trim();
  if (q === "") return cache.slice();

  const qLower = q.toLowerCase();
  // For dial-code matching we want both "+972" and "972" to match a
  // dialCode of "+972". We normalize both sides by stripping a leading +.
  const qStripped = q.startsWith("+") ? q.slice(1) : q;

  /** @type {Country[]} */ const exactIso2 = [];
  /** @type {Country[]} */ const nameStarts = [];
  /** @type {Country[]} */ const dialStarts = [];
  /** @type {Country[]} */ const substring = [];

  for (const c of cache) {
    const name = c.name.toLowerCase();
    const iso2 = c.iso2.toLowerCase();
    const iso3 = c.iso3.toLowerCase();
    const dialStripped = c.dialCode.startsWith("+")
      ? c.dialCode.slice(1)
      : c.dialCode;

    if (iso2 === qLower) {
      exactIso2.push(c);
      continue;
    }
    if (name.startsWith(qLower)) {
      nameStarts.push(c);
      continue;
    }
    if (dialStripped.startsWith(qStripped)) {
      dialStarts.push(c);
      continue;
    }
    if (
      name.includes(qLower) ||
      iso2.includes(qLower) ||
      iso3.includes(qLower) ||
      dialStripped.includes(qStripped)
    ) {
      substring.push(c);
    }
  }

  return [...exactIso2, ...nameStarts, ...dialStarts, ...substring];
}

/**
 * Test-only helper: resets the module cache. Pass a country array to
 * seed the cache directly (bypassing fetch). Pass `null` to clear it.
 *
 * @internal
 * @param {Country[] | null} seed
 */
export function _resetForTests(seed) {
  cache = seed;
  inflight = null;
}
