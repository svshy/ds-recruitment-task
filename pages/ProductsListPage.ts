import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { sumCounts } from "@helpers/category";
import { CartModal } from "@components/CartModal";
import { Toast } from "@components/Toast";

const SELECTORS = {
  container: ".groups-in-filters a",
  count: ".count",
  name: ".group-filter-name",
  manufacturerFilter: ".searchManufacturer",
  manufacturerCheckbox: "#man_Manufacturers",
  activeFilter: ".active_filters_span",
  productCard: '[data-product-price]:has([title="Do koszyka"])',
  listingTitle: ".new-h1-fulloffer",
  productDescription: ".description",
};

export class ProductsListPage extends BasePage {
  readonly subcategoriesList: Locator;
  readonly subcategoriesCounters: Locator;
  readonly subcategoriesNames: Locator;
  readonly showResultsButton: Locator;
  readonly activeFilters: Locator;
  readonly productCards: Locator;
  readonly listingTitle: Locator;
  readonly cartModal: CartModal;
  readonly toast: Toast;

  constructor(page: Page) {
    super(page);
    this.subcategoriesList = page
      .locator(SELECTORS.container)
      .filter({ has: page.locator(SELECTORS.count) })
      .filter({ has: page.locator(SELECTORS.name) });
    this.subcategoriesCounters = this.subcategoriesList.locator(SELECTORS.count);
    this.subcategoriesNames = this.subcategoriesList.locator(SELECTORS.name);
    this.showResultsButton = page.getByRole("button", { name: "Pokaż wyniki" });
    this.activeFilters = page.locator(SELECTORS.activeFilter);
    this.productCards = page.locator(SELECTORS.productCard);
    this.listingTitle = page.locator(SELECTORS.listingTitle);
    this.cartModal = new CartModal(page);
    this.toast = new Toast(page);
  }

  async getSubcategoriesProductCount(): Promise<number> {
    await this.waitForVisible(this.subcategoriesList.first());
    const count = sumCounts(await this.subcategoriesCounters.allTextContents());
    return count;
  }

  async filterByFirstManufacturer(): Promise<string> {
    const manufacturerName = await this.page.locator(SELECTORS.manufacturerFilter).first().getAttribute("data-value");
    if (!manufacturerName) throw new Error("Manufacturer data-value not found");
    const checkbox = this.page.locator(`[data-value="${manufacturerName}"]`).locator(SELECTORS.manufacturerCheckbox);
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await Promise.all([
      this.waitForResponseWithStatus(`manufacturers=${encodeURIComponent(manufacturerName)}`, 200),
      this.showResultsButton.click(),
    ]);
    await this.waitForVisible(this.activeFilters.filter({ hasText: manufacturerName }));
    return manufacturerName;
  }

  async getProductData(card: Locator): Promise<{ title: string; price: string }> {
    const title = await card.locator(SELECTORS.productDescription).textContent();
    const price = await card.getByTestId("tap-item-product-price").filter({ visible: true }).textContent();
    if (title === null) throw new Error("Product title not found");
    if (price === null) throw new Error("Product price not found");
    return { title, price };
  }

  async addProductToCart(card: Locator): Promise<void> {
    await card.getByTitle("Do koszyka").click();
    await Promise.all([this.waitForResponseWithStatus("/cart/cartadd/", 200), this.cartModal.continueShopping()]);
    await this.toast.close();
  }

  async addProductsToCart(count: number): Promise<Array<{ title: string; price: string }>> {
    await this.waitForVisible(this.productCards.first());
    const cards = Array.from({ length: count }, (_, i) => this.productCards.nth(i));
    const productData = await Promise.all(cards.map((card) => this.getProductData(card)));
    for (const card of cards) {
      await this.addProductToCart(card);
    }
    return productData;
  }
}
