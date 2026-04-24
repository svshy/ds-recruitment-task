import { Page, Locator } from "@playwright/test";

export class CookieBanner {
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.cookieAcceptButton = page.getByTestId("tap-osano-accept");
  }

  async acceptCookies(): Promise<void> {
    await this.cookieAcceptButton.click();
  }
}
