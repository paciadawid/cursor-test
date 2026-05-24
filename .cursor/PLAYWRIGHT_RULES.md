# Playwright / Cursor Rules for this project

Purpose
- Capture project-specific testing conventions and Playwright best practices so tests stay reliable, fast and maintainable.

Where to put tests
- Keep tests in `tests/` (already configured in `playwright.config.ts`).
- Use subfolders for areas (e.g., `tests/pages`, `tests/e2e`, `tests/api`).

Fixtures & Test Setup
- Provide reusable fixtures in `tests/fixtures.ts`. Keep fixtures scoped to the test worker when possible.
- Use `storageState` for authenticated flows when you need to avoid UI login every time.
- Keep test data and secrets out of the repo; use environment variables or a secret store.

Page Object Pattern
- Encapsulate page interactions in page objects under `tests/pages/` (we already added `LoginPage` and `HomePage`).
- Page objects should expose high-level actions (e.g., `login(email, pass)`), not test assertions.

Selectors
- Preferred selector priority (most stable → least stable):
  1. CSS selectors (and XPath when necessary for complex relationships) — e.g. `page.locator('.btn-login')`, `page.locator('//button[text()=\"Log in\"]')`
  2. role selectors with accessible name (Playwright `getByRole`) — e.g. `page.getByRole('button', { name: 'Save' })`
  3. explicit test ids / data attributes (e.g. `data-test-id`, `data-testid`) — e.g. `page.locator('[data-test-id=\"login-submit\"]')`
  4. ARIA selectors (labels, placeholders) when appropriate — e.g. `getByLabel`, `getByPlaceholder`
  5. Text selectors for user-facing text (use carefully for dynamic copy)

- Prefer CSS for most element targeting — it's fast, familiar, and integrates well with styling hooks. Use XPath only when the DOM relationship is complex and cannot be expressed cleanly with CSS.
- Avoid brittle selectors such as deep CSS paths, `nth-child`, or relying on layout/position. Prefer stable class names, data attributes, or meaningful structural selectors.
- Centralize selectors and locator logic inside page objects so updates are easy and consistent.
- If possible, add `data-test-id` (or `data-testid`) attributes in the application code as optional stable hooks; they are a good fallback for targeting specific elements. Example:

```html
<button data-test-id="login-submit">Log in</button>
```

```ts
// page object
await this.page.locator('[data-test-id=\"login-submit\"]').click();
```

- Examples:
  - `page.locator('.login-form input[type=\"email\"]')`
  - `page.locator('//form[@id=\"login\"]/button[contains(. , \"Log in\")]')`
  - `page.getByRole('heading', { level: 1, name: 'Welcome to our store.' })`

- Note: If the app cannot be changed to include test ids, use the most stable available semantic selector (role/label/name) and document the fallback in the page object.
 - Prefer CSS for most element targeting — it's fast, familiar, and integrates well with styling hooks. Use XPath only when the DOM relationship is complex and cannot be expressed cleanly with CSS.
 - Avoid brittle selectors such as deep CSS paths, `nth-child`, or relying on layout/position. Prefer stable class names, data attributes, or meaningful structural selectors.
 - Avoid selectors based on visible UI text (e.g. `getByText`, locator text snippets, or passing visible string to `getByRole`), because they break across localized builds and copy changes. Instead:
   - Prefer `data-test-id` attributes or stable ARIA attributes that are independent of displayed text.
   - If you must rely on text, use stable translation keys in attributes (e.g. `data-i18n-key="login.submit"`) or match with regexes carefully and document the locale assumptions.
 - Centralize selectors and locator logic inside page objects so updates are easy and consistent.
 - If possible, add `data-test-id` (or `data-testid`) attributes in the application code as optional stable hooks; they are a good fallback for targeting specific elements. Example:
 
 ```html
 <button data-test-id="login-submit">Log in</button>
 ```
 
 ```ts
 // page object
 await this.page.locator('[data-test-id=\"login-submit\"]').click();
 ```
 
 - Examples:
   - `page.locator('.login-form input[type=\"email\"]')`
   - `page.locator('//form[@id=\"login\"]/button[contains(. , \"Log in\")]')` (XPath only when necessary)
   - `page.getByRole('heading', { level: 1, name: 'Welcome to our store.' })` (use with caution in localized apps)
 
 - Note: If the app cannot be changed to include test ids, use the most stable available semantic selector (role/label/name) and document the fallback in the page object.

Assertions & Waiting
- Use Playwright `expect` for assertions (supports auto-waiting).
- Avoid manual waits (`page.waitForTimeout`). Use `expect(locator).toBeVisible()` or `locator.waitFor()` when necessary.
- Use `expect.soft` for non-blocking assertions (where helpful).

Parallelism & Isolation
- Tests should be independent and idempotent. Avoid shared mutable state.
- Use Playwright projects/workers to run independent tests in parallel (config already limits to chromium only).

Timeouts & Retries
- Use sensible timeouts per-action if needed, but rely on Playwright's defaults. Configure global timeouts in `playwright.config.ts`.
- Enable retries for CI only: `retries: process.env.CI ? 2 : 0`.

CI & Reporting
- Keep `reporter: 'html'` for local debugging; in CI produce JUnit or other machine-readable reports if required.
- Upload Playwright traces/videos/screenshots from failed runs in CI for debugging.

Network & Test Stability
- Mock network responses for edge-case tests and to make tests deterministic.
- For end-to-end smoke tests, prefer real network only for high-value flows; capture and assert key network requests when useful.

Debugging
- Use `--headed` and `--debug` locally when investigating failures.
- Enable `trace: 'on-first-retry'` in CI to save artifacts only when a test flakes.

Lints & Formatting
- Keep TypeScript strictness where possible. Add linting (eslint/tsconfig) if not present.

Naming & Organization
- Tests: `describe('feature')` and `test('should ...')` — write behaviour-driven names.
- File names: `*.spec.ts` in `tests/` folder.

Examples
- Use fixtures:
```ts
import { test, expect } from './fixtures';

test('login', async ({ loginPage, homePage }) => {
  await loginPage.login('user@example.com', 'pw');
  await homePage.expectSignedIn();
});
```

Maintenance
- Periodically run the full suite locally and in CI.
- When a flaky test appears, immediately add retries and a trace, then fix root cause.

Where this lives
- This file: `.cursor/PLAYWRIGHT_RULES.md` — update as the project evolves.

External documentation (Context7) usage
- When using Context7 or any external docs provider, prefer the official project documentation and the newest stable version.
  - Official sources for Playwright: `playwright.dev` (primary) and the official Microsoft package `/microsoft/playwright`.
  - When resolving library IDs, prefer IDs that map to the official site or vendor-maintained packages (e.g., `/websites/playwright_dev`, `/microsoft/playwright`).
  - If a version is required, omit the version in the library ID so Context7 returns the newest available stable version; explicitly request a version only when you need a specific legacy API.
- Selection heuristics when resolving docs automatically:
  1. Prefer "official" or vendor-maintained IDs (site or org-owned).
  2. Prefer higher source reputation and benchmark score.
  3. Prefer entries with the most recent version or with explicit "latest" support.
  4. Avoid community mirrors unless the official source lacks coverage for the requested topic.
- Practical rule for tool usage:
  - Call `resolve-library-id` first and pick the top official match (document why selected).
  - Then call `query-docs` with the selected library ID and a clear, focused question.
  - Do not call `query-docs` more than 3 times per user request.

