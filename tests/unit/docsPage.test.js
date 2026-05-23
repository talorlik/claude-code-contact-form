import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();

function readProjectFile(path) {
  return readFileSync(join(rootDir, path), "utf8");
}

describe("GitHub Pages documentation site", () => {
  test("documents the project without embedding the live contact form", () => {
    const html = readProjectFile("docs/index.html");

    expect(html).toContain("Claude Code Contact Form");
    expect(html).toContain("Project Showcase");
    expect(html).toContain("Documentation Hub");
    expect(html).toContain("npm run test:unit");
    expect(html).toContain("npm run test:integration");
    expect(html).toContain("npm run test:e2e");
    expect(html).toContain(
      'href="https://github.com/talorlik/claude-code-contact-form/blob/main/README.md"',
    );
    expect(html).toContain(
      'href="https://github.com/talorlik/claude-code-contact-form/blob/main/docs/assignment/ASSIGNMENT.md"',
    );
    expect(html).not.toContain('id="contactForm"');
    expect(html).not.toContain('name="fullName"');
  });

  test("loads the expected page assets and theme controls", () => {
    const html = readProjectFile("docs/index.html");
    const css = readProjectFile("docs/styles.css");
    const js = readProjectFile("docs/main.js");

    expect(html).toContain('href="./favicon.ico"');
    expect(html).toContain('src="./header_banner.png"');
    expect(html).toContain('href="./styles.css"');
    expect(html).toContain('src="./main.js"');
    expect(html).toContain('id="themeToggle"');
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
    expect(js).toContain("contact-form-docs-theme");
    expect(js).toContain("application/ld+json");
  });
});
