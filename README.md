# ds-recruitment-task

Playwright E2E test suite for the [Intercars.pl](https://intercars.pl) online shop.

> **⚠ Cloudflare protection:** Intercars.pl blocks requests from Playwright-controlled browsers.
> Clicking the Cloudflare checkbox in headed mode does not help — it triggers an infinite CAPTCHA
> loop. **Use `npm run test:cdp:headed`** (see [CDP test](#cdp-test)) to run tests against a
> regular Chrome instance that bypasses this restriction.

The suite covers the following user flow:

1. Navigate to the homepage and accept the cookie banner.
2. Open the category listing and select the category with the highest product count.
3. Assert that the sum of subcategory product counts matches the parent category count.
4. Filter products by the first available manufacturer.
5. Add the first two products to the cart and verify that item prices and the cart total are correct.

---

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

---

## Installation

```bash
npm ci
```

---

## Running tests

| Command                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `npm run test:e2e`        | Run the standard Playwright test (headless)              |
| `npm run test:e2e:headed` | Run the standard Playwright test in headed mode          |
| `npm run test:cdp:headed` | Run the CDP test against an already-open Chrome instance |

> **Note:** `test:e2e` and `test:e2e:headed` will fail. Intercars.pl is protected by Cloudflare,
> which blocks requests originating from a Playwright-controlled browser. Manual interaction in
> the headed window does not help — clicking the Cloudflare checkbox triggers a repeated CAPTCHA
> loop with no way to pass it. Use `test:cdp:headed` instead (see below).

### Known test failure — subcategory product count assertion

Step 3 of the flow asserts that the sum of all subcategory product counts equals the parent
category count displayed on the listing page. In practice these numbers do not match on the live
site. Because this is a data inconsistency on the website rather than a test implementation error, the assertion is implemented
as a **soft assertion** — the test continues executing the remaining steps but ultimately reports
a failure at the end due to this mismatch.

### CDP test

Intercars.pl uses Cloudflare bot protection that blocks requests made by a browser launched
directly by Playwright — even when the page is interacted with manually in the headed window.
To work around this, the CDP spec (`intercars-category-filter-cart.cdp.spec.ts`) connects to a
**regular Chrome instance** you start yourself, which already has a normal browser profile and
is not flagged by Cloudflare.

#### Step 1 — Launch Chrome with remote debugging

**Windows**

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-cdp"
```

#### Step 2 — Complete Chrome's first-run setup

Because the `--user-data-dir` points to a fresh directory, Chrome will show its initial
configuration wizard. Click through all the prompts (default browser, Google account sign-in,
search engine selection) before proceeding.

> **Note:** After each test run you have two options for the next run:
>
> - **Clean profile (recommended):** Close Chrome, delete the `user-data-dir` folder
>   (`C:\temp\chrome-cdp` on Windows), then repeat Steps 1–3
>   from scratch. This guarantees a clean state.
> - **Reuse the existing Chrome instance:** Keep Chrome open and manually empty the cart at
>   [intercars.pl/cart](https://intercars.pl/cart) before running the test again. Skipping this
>   will cause the cart-verification step to fail because items from the previous run are still
>   present.

#### Step 3 — Run the test

```bash
npm run test:cdp:headed
```

---

## Project structure

```
├── components/       # Reusable page components (Menu, CartModal, Toast, CookieBanner)
├── fixtures/         # Playwright fixture definitions (standard + CDP)
├── helpers/          # Pure utility functions (price parsing, count helpers)
├── jenkins/          # Jenkins CI configuration (Dockerfile, docker-compose, casc, Jenkinsfile)
├── pages/            # Page Object Models
└── tests/            # Test specs
```

---

## CI / Jenkins

A self-contained Jenkins environment is provided in the `jenkins/` directory.

### Start Jenkins locally

```bash
cd jenkins
docker compose up --build
```

Jenkins will be available at `http://localhost:8080` (default credentials: `admin` / `admin`).

On the first run Jenkins may display a **"Customize Jenkins"** screen asking about additional
plugins — simply close or skip it. After that, a **"Jenkins is ready!"** screen will appear;
click **"Start using Jenkins"** to proceed to the dashboard.

The dashboard will show a single pre-configured job: **ds-recruitment-task**. Click it, then
click **"Build Now"** to trigger a run. Once the build finishes, open it from the build history
and click **"Playwright Test Report"** in the left-hand sidebar to view the full HTML report.

The pipeline (`jenkins/Jenkinsfile`) runs inside the official
`mcr.microsoft.com/playwright:v1.59.1-noble` Docker image, installs npm dependencies, executes
the E2E test, and publishes the HTML report.
