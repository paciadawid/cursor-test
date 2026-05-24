import { Browser } from '@playwright/test';
import type { StorageState } from '@playwright/test';
import { test as base, expect } from './fixtures';
import { LoginPage } from './pages/login.page';

/**
 * Extends base fixtures with worker-scoped UI login and storageState.
 * Use for E2E tests that require an authenticated session.
 */
export const test = base.extend<object, { workerStorageState: StorageState }>({
  workerStorageState: [
    async ({ browser }: { browser: Browser }, use) => {
      const baseURL =
        process.env.BASE_URL ?? 'https://bearstore-testsite.smartbear.com/';
      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();
      const email = process.env.TEST_USER_EMAIL;
      const password = process.env.TEST_USER_PASSWORD;
      if (!email || !password) {
        throw new Error(
          'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set (see .env.example)',
        );
      }

      const loginPage = new LoginPage(page);
      await loginPage.login(email, password);

      const state = await context.storageState();
      await context.close();
      await use(state);
    },
    { scope: 'worker' },
  ],

  storageState: async ({ workerStorageState }, use) => {
    await use(workerStorageState);
  },
});

export { expect };
