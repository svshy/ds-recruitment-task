import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getMaxCountAndIndex } from "@helpers/category";

export class CategoriesPage extends BasePage {
  readonly categoriesList: Locator;
  readonly categoriesCounters: Locator;
  readonly categoriesNames: Locator;
  constructor(page: Page) {
    super(page);
    this.url = "https://intercars.pl/oferta";
    this.categoriesList = page
      .locator("#fulloffer-categories-tabs a")
      .filter({ has: page.locator(".count") })
      .filter({ has: page.locator(".group-filter-name") });
    this.categoriesCounters = this.categoriesList.locator(".count");
    this.categoriesNames = this.categoriesList.locator(".group-filter-name");
  }

  async clickCategoryWithHighestCount(): Promise<{ categoryName: string; count: number }> {
    await this.waitForVisible(this.categoriesList.first());
    const { index, count } = getMaxCountAndIndex(await this.categoriesCounters.allTextContents());
    const categoryName = await this.categoriesNames.nth(index).textContent();
    if (!categoryName) throw new Error(`Category name not found at index ${index}`);
    await this.categoriesList.nth(index).click();
    return { categoryName, count };
  }
}
