import { defineConfig } from "eslint/config";
import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["tests/**/*.ts", "pages/**/*.ts", "components/**/*.ts", "helpers/**/*.ts", "fixtures/**/*.ts"],
    extends: [...tseslint.configs.recommended, playwright.configs["flat/recommended"]],
    rules: {},
  },
]);
