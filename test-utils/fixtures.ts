import {
  test as base,
  expect as baseExpect,
  type APIRequestContext,
} from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { HomePage } from './pages/home.page';

/** Base fixtures: page objects + GoRest API client (no UI auth). */
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  gorestRequest?: APIRequestContext | undefined;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  gorestRequest: async ({ playwright }, use) => {
    const token = process.env.GOREST_TOKEN;
    if (!token) {
      await use(undefined);
      return;
    }

    const req = await playwright.request.newContext({
      baseURL: 'https://gorest.co.in/public/v2/',
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    await use(req);
    await req.dispose();
  },
});

export const expect = baseExpect;
