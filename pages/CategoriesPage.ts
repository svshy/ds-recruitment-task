import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getMaxCountAndIndex } from "@helpers/category";

const SELECTORS = {
  container: "#fulloffer-categories-tabs a",
  count: ".count",
  name: ".group-filter-name",
};

export class CategoriesPage extends BasePage {
  readonly categoriesList: Locator;
  readonly categoriesCounters: Locator;
  readonly categoriesNames: Locator;
  constructor(page: Page) {
    super(page);
    this.url = "https://intercars.pl/oferta";
    this.categoriesList = page
      .locator(SELECTORS.container)
      .filter({ has: page.locator(SELECTORS.count) })
      .filter({ has: page.locator(SELECTORS.name) });
    this.categoriesCounters = this.categoriesList.locator(SELECTORS.count);
    this.categoriesNames = this.categoriesList.locator(SELECTORS.name);
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
