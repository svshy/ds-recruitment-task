import { Page, Locator } from "@playwright/test";

export class Toast {
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.closeButton = page.getByRole("button", { name: "Zamknij" });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
