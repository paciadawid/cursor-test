import { test, expect } from '../test-utils/fixtures.authenticated';

test.describe('Example tests', () => {
  test.describe('public (no auth)', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should show the shop homepage', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle('Shop');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Welcome to our store.' }),
      ).toBeVisible();
    });
  });

  test('should land on home after worker login', async ({ homePage, page }) => {
    await page.goto('/');
    await expect(homePage.getLandingHeading()).toBeVisible();
  });
});
