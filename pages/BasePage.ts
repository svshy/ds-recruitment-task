import { Locator, Page, expect } from "@playwright/test";

export abstract class BasePage {
  protected page: Page;
  protected url: string = "";

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = this.url): Promise<void> {
    await this.page.goto(path);
  }

  async verifyTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
  }

  async waitForResponseWithStatus(urlSubstring: string, status: number): Promise<void> {
    await this.page.waitForResponse((r) => r.url().includes(urlSubstring) && r.status() === status);
  }
}
