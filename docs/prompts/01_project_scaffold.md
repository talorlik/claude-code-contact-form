# Prompt 01: Project Scaffold

Use this prompt with Claude Code.

```text
You are working in a new project folder for a beginner HTML/CSS/JavaScript assignment.

Create the following project structure:

claude-code-contact-form/
  docs/
    assignment/
    planning/
    prompts/
  images/
  css/
  javascript/
  tests/
    unit/
    integration/
    e2e/
  index.html
  README.md
  package.json
  vitest.config.js
  playwright.config.js

Requirements:
1. Create all folders and files if they do not exist.
2. Do not implement the full application yet.
3. Add minimal placeholder comments only where useful.
4. Configure package.json with these scripts:
   - "test:unit"
   - "test:integration"
   - "test:e2e"
   - "test"
5. Use Vitest for unit and integration tests.
6. Use Playwright for e2e tests.
7. Keep the runtime application plain HTML, CSS, and JavaScript.
8. Do not add React, Vue, Angular, jQuery, Bootstrap, or any runtime framework.

After creating the scaffold, print the resulting file tree.
```
