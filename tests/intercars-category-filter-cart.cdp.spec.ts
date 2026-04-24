import { test, expect } from "@fixtures/cdpFixtures";

//"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-cdp"

test("Filter by top manufacturer in category with highest product count (CDP)", async ({
  homePage,
  categoriesPage,
  productsListPage,
  menu,
  cartPage,
  cookieBanner,
}) => {
  const { selectedCategoryName, categoryProductCount } =
    await test.step("Navigate to Intercars homepage and select category with highest product count", async () => {
      await homePage.goto();
      await homePage.verifyTitle(homePage.pageTitle);
      await cookieBanner.acceptCookies();
      await menu.allCategoriesMenuItem.click();
      await menu.seeAllCategoriesLink.click();

      const { categoryName, count } = await categoriesPage.clickCategoryWithHighestCount();
      return { selectedCategoryName: categoryName, categoryProductCount: count };
    });

  await test.step(`Verify that sum of subcategory product counts matches category product count`, async () => {
    const subcategoriesProductCount = await productsListPage.getSubcategoriesProductCount();

    expect
      .soft(
        subcategoriesProductCount,
        `"${selectedCategoryName}": sum of subcategory counts (${subcategoriesProductCount}) should match category product count (${categoryProductCount})`
      )
      .toBe(categoryProductCount);
  });

  await test.step(`Filter products by top manufacturer and verify results`, async () => {
    const manufacturerFilterName = await productsListPage.filterByFirstManufacturer();
    await expect(productsListPage.listingTitle).toHaveText(selectedCategoryName + " " + manufacturerFilterName);
  });

  await test.step(`Add first two products to cart and verify cart contents`, async () => {
    const products = await productsListPage.addProductsToCart(2);
    await menu.cartLink.click();
    await cartPage.verifyTitle(cartPage.pageTitle);
    await cartPage.verifyCartContents(products);
  });
});
