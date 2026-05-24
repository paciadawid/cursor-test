import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput;
  readonly passwordInput;
  readonly submitButton;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = this.page
      .locator(
        'input[name="Email"], input[id="Email"], input[placeholder*="Username"], input[placeholder*="email"]',
      )
      .first();
    this.passwordInput = this.page.locator('input[type="password"]');
    this.submitButton = this.page
      .locator('button:has-text("Log in"), input[type="submit"][value*="Log"]')
      .first();
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}
