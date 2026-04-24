import { Page, Locator } from "@playwright/test";

export class Menu {
  readonly allCategoriesMenuItem: Locator;
  readonly seeAllCategoriesLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.allCategoriesMenuItem = page.getByTestId("tap-menu-test-main");
    this.seeAllCategoriesLink = page.getByRole("link", { name: "Zobacz wszystkie" });
    this.cartLink = page.getByRole("link", { name: "Koszyk" });
  }
}
