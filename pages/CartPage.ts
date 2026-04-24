import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { parsePrice } from "@helpers/price";
import { Product } from "@helpers/types";

export class CartPage extends BasePage {
  readonly pageTitle = "Koszyk - Sklep Inter Cars";
  readonly cartItem: Locator;
  readonly totalCartPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "https://intercars.pl/cart";
    this.cartItem = page.locator(".cart-item-row");
    this.totalCartPrice = page.locator(".summary-payment-info").filter({ visible: true });
  }

  private productPrice(cartProduct: Locator): Locator {
    return cartProduct.locator(".cart_price_total_item");
  }

  async verifyCartItemPriceMatchesListing(product: Product): Promise<void> {
    const row = this.cartItem.filter({ hasText: product.title });
    const priceText = await this.productPrice(row).textContent();
    if (priceText === null) throw new Error(`Price not found for product: ${product.title}`);
    expect(parsePrice(priceText)).toBe(parsePrice(product.price));
  }

  async getTotalCartPrice(): Promise<string> {
    const text = await this.totalCartPrice.textContent();
    if (text === null) throw new Error("Cart summary text not found");
    return text;
  }

  async verifyTotalMatchesProducts(products: Product[]): Promise<void> {
    const totalCartPrice = await this.getTotalCartPrice();
    const expectedTotal = products.reduce((sum, p) => sum + parsePrice(p.price), 0);
    expect(expectedTotal).toBe(parsePrice(totalCartPrice));
  }

  async verifyCartContents(products: Product[]): Promise<void> {
    for (const product of products) {
      await this.verifyCartItemPriceMatchesListing(product);
    }
    await this.verifyTotalMatchesProducts(products);
  }
}
