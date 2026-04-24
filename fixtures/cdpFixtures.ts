import { test as base, Page, chromium as playwrightChromium } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { CategoriesPage } from "@pages/CategoriesPage";
import { ProductsListPage } from "@pages/ProductsListPage";
import { Menu } from "@components/Menu";
import { CartPage } from "@pages/CartPage";
import { CookieBanner } from "@components/CookieBanner";

const CDP_ENDPOINT = "http://localhost:9222";

type PagesFixtures = {
  homePage: HomePage;
  categoriesPage: CategoriesPage;
  productsListPage: ProductsListPage;
  menu: Menu;
  cartPage: CartPage;
  cdpPage: Page;
  cookieBanner: CookieBanner;
};

export const test = base.extend<PagesFixtures>({
  cdpPage: async ({}, use) => {
    const browser = await playwrightChromium.connectOverCDP(CDP_ENDPOINT);
    const context = browser.contexts()[0] ?? (await browser.newContext());
    const page = await context.newPage();
    await use(page);
    await page.close();
    await context.close();
    await browser.close();
  },
  homePage: async ({ cdpPage }, use) => {
    await use(new HomePage(cdpPage));
  },
  categoriesPage: async ({ cdpPage }, use) => {
    await use(new CategoriesPage(cdpPage));
  },
  productsListPage: async ({ cdpPage }, use) => {
    await use(new ProductsListPage(cdpPage));
  },
  menu: async ({ cdpPage }, use) => {
    await use(new Menu(cdpPage));
  },
  cartPage: async ({ cdpPage }, use) => {
    await use(new CartPage(cdpPage));
  },
  cookieBanner: async ({ cdpPage }, use) => {
    await use(new CookieBanner(cdpPage));
  },
});

export { expect, Locator } from "@playwright/test";
