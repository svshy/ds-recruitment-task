import { defineConfig } from "eslint/config";
import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["tests/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {},
  },
]);
