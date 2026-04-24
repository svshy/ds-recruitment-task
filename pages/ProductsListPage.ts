import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { sumCounts } from "@helpers/category";
import { Product } from "@helpers/types";
import { CartModal } from "@components/CartModal";
import { Toast } from "@components/Toast";

export class ProductsListPage extends BasePage {
  readonly subcategoriesList: Locator;
  readonly subcategoriesCounters: Locator;
  readonly showResultsButton: Locator;
  readonly activeFilters: Locator;
  readonly products: Locator;
  readonly listingTitle: Locator;
  readonly manufacturerFilters: Locator;
  readonly cartModal: CartModal;
  readonly toast: Toast;

  constructor(page: Page) {
    super(page);
    this.subcategoriesList = page
      .locator(".groups-in-filters a")
      .filter({ has: page.locator(".count") })
      .filter({ has: page.locator(".group-filter-name") });
    this.subcategoriesCounters = this.subcategoriesList.locator(".count");
    this.showResultsButton = page.getByRole("button", { name: "Pokaż wyniki" });
    this.activeFilters = page.locator(".active_filters_span");
    this.products = page.locator("[data-product-price]").filter({ has: page.locator('[title="Do koszyka"]') });
    this.listingTitle = page.locator(".new-h1-fulloffer");
    this.manufacturerFilters = page.locator(".searchManufacturer");
    this.cartModal = new CartModal(page);
    this.toast = new Toast(page);
  }

  private manufacturerCheckbox(manufacturerName: string): Locator {
    return this.page.locator(`[data-value="${manufacturerName}"]`).locator("#man_Manufacturers");
  }

  private productTitle(product: Locator): Locator {
    return product.locator(".description");
  }

  private productPrice(product: Locator): Locator {
    return product.getByTestId("tap-item-product-price").filter({ visible: true });
  }

  private addToCartButton(product: Locator): Locator {
    return product.getByTitle("Do koszyka");
  }

  async getTotalSubcategoriesProductCount(): Promise<number> {
    await this.waitForVisible(this.subcategoriesList.first());
    const count = sumCounts(await this.subcategoriesCounters.allTextContents());
    return count;
  }

  async filterByFirstManufacturer(): Promise<string> {
    const manufacturerName = await this.manufacturerFilters.first().getAttribute("data-value");
    if (!manufacturerName) throw new Error("Manufacturer data-value not found");
    const checkbox = this.manufacturerCheckbox(manufacturerName);
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await Promise.all([
      this.waitForResponseWithStatus(`manufacturers=${encodeURIComponent(manufacturerName)}`, 200),
      this.showResultsButton.click(),
    ]);
    await this.waitForVisible(this.activeFilters.filter({ hasText: manufacturerName }));
    return manufacturerName;
  }

  async getProductData(product: Locator): Promise<Product> {
    const title = await this.productTitle(product).textContent();
    const price = await this.productPrice(product).textContent();
    if (title === null) throw new Error("Product title not found");
    if (price === null) throw new Error("Product price not found");
    return { title, price };
  }

  async addProductToCart(product: Locator): Promise<void> {
    await this.addToCartButton(product).click();
    await Promise.all([this.waitForResponseWithStatus("/cart/cartadd/", 200), this.cartModal.continueShopping()]);
    await this.toast.close();
  }

  async addProductsToCart(productCount: number): Promise<Product[]> {
    await this.waitForVisible(this.products.first());
    const selectedProducts = Array.from({ length: productCount }, (_, i) => this.products.nth(i));
    const productData = await Promise.all(selectedProducts.map((product) => this.getProductData(product)));
    for (const product of selectedProducts) {
      await this.addProductToCart(product);
    }
    return productData;
  }
}
