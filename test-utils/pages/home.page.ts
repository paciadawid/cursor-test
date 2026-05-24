import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading;

  constructor(page: Page) {
    this.page = page;
    this.heading = this.page.getByRole('heading', { level: 1, name: 'Welcome to our store.' });
  }

  // Non-asserting helper: returns true if the current page is not the login page.
  async isSignedIn(): Promise<boolean> {
    return !(await this.page.url()).includes('/login');
  }

  // Expose a method that returns the landing heading locator (no assertions here).
  getLandingHeading() {
    return this.heading;
  }
}
