import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly pageTitle = "Sklep motoryzacyjny: opony i części samochodowe | Intercars.pl";

  constructor(page: Page) {
    super(page);
    this.url = "https://intercars.pl";
  }
}
