import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { parsePrice } from "@helpers/price";

const SELECTORS = {
  cartItem: ".cart-item-row",
  itemPrice: ".cart_price_total_item",
  cartSummary: ".summary-payment-info",
};

export class CartPage extends BasePage {
  readonly pageTitle = "Koszyk - Sklep Inter Cars";
  readonly cartItem: Locator;
  readonly totalCartPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "https://intercars.pl/cart";
    this.cartItem = page.locator(SELECTORS.cartItem);
    this.totalCartPrice = page.locator(SELECTORS.cartSummary).filter({ visible: true });
  }

  async verifyProductPrice(product: { title: string; price: string }): Promise<void> {
    const row = this.cartItem.filter({ hasText: product.title });
    const priceText = await row.locator(SELECTORS.itemPrice).textContent();
    if (priceText === null) throw new Error(`Price not found for product: ${product.title}`);
    expect(parsePrice(priceText)).toBe(parsePrice(product.price));
  }

  async getTotalCartPrice(): Promise<string> {
    const text = await this.totalCartPrice.textContent();
    if (text === null) throw new Error("Cart summary text not found");
    return text;
  }

  async verifyTotalMatchesProducts(products: Array<{ price: string }>): Promise<void> {
    const totalCartPrice = await this.getTotalCartPrice();
    const expectedTotal = products.reduce((sum, p) => sum + parsePrice(p.price), 0);
    expect(expectedTotal).toBe(parsePrice(totalCartPrice));
  }

  async verifyCartContents(products: Array<{ title: string; price: string }>): Promise<void> {
    for (const product of products) {
      await this.verifyProductPrice(product);
    }
    await this.verifyTotalMatchesProducts(products);
  }
}
