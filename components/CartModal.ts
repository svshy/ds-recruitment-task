import { Page, Locator } from "@playwright/test";

export class CartModal {
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.continueShoppingButton = page.getByRole("button", { name: "Kontynuuj zakupy" });
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
