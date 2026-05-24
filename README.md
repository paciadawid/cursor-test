# Playwright + TypeScript skeleton

Run tests:

```bash
npm install
npx playwright install
npm test
```

- **`npm run test:ui`** – interactive UI mode
- **`npm run test:headed`** – run tests in headed browsers
- **`npm run report`** – open the last HTML report

Update `baseURL` in `playwright.config.ts` for your app. Add specs under `tests/`.

### Playwright MCP (Cursor / AI agents)

The [Playwright MCP](https://playwright.dev/agents) server is added so Cursor (or other MCP clients) can drive a browser from chat.

- **Project:** `@playwright/mcp` is in `devDependencies`; `.cursor/mcp.json` configures the MCP server.
- **Enable in Cursor:** Ensure the Playwright MCP server is enabled in **Cursor → Settings → Features → MCP**. If the project config is not picked up, add a server manually:
  - **Command:** `npx`
  - **Arguments:** `@playwright/mcp@latest`
- **Usage:** In Composer you can ask the agent to navigate, click, fill forms, take snapshots, etc. It uses Playwright’s accessibility snapshot (no vision model).
