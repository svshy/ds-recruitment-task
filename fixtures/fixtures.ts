import { test as base } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { CategoriesPage } from "@pages/CategoriesPage";
import { ProductsListPage } from "@pages/ProductsListPage";
import { Menu } from "@components/Menu";
import { CartPage } from "@pages/CartPage";
import { CookieBanner } from "@components/CookieBanner";

type PagesFixtures = {
  homePage: HomePage;
  categoriesPage: CategoriesPage;
  productsListPage: ProductsListPage;
  menu: Menu;
  cartPage: CartPage;
  cookieBanner: CookieBanner;
};

export const test = base.extend<PagesFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  categoriesPage: async ({ page }, use) => {
    await use(new CategoriesPage(page));
  },
  productsListPage: async ({ page }, use) => {
    await use(new ProductsListPage(page));
  },
  menu: async ({ page }, use) => {
    await use(new Menu(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  cookieBanner: async ({ page }, use) => {
    await use(new CookieBanner(page));
  },
});

export { expect, Locator } from "@playwright/test";
