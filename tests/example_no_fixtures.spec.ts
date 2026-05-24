import { test, expect } from '@playwright/test';
import { LoginPage } from '../test-utils/pages/login.page';
import { HomePage } from '../test-utils/pages/home.page';

/**
 * Examples that use page objects without custom fixtures.
 * Prefer fixtures.authenticated.ts for tests that need shared login.
 */
test.describe('Examples without fixtures', () => {
  test('should show the shop homepage (no auth)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Shop');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Welcome to our store.' }),
    ).toBeVisible();
  });

  test('should login using page objects directly', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    test.skip(!email || !password, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD');

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.login(email!, password!);
    await expect(homePage.getLandingHeading()).toBeVisible();
  });
});
