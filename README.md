# Stripe Customer BDD Automation

Playwright + Cucumber BDD test automation for Stripe Customer Management covering **CUST-001 to CUST-040**.

## Project Structure

```
stripe-customer-bdd/
├── features/
│   ├── navigation/
│   │   └── stripe_customer_navigation.feature
│   ├── happy_path/
│   │   └── stripe_customer_creation_happy_path.feature
│   ├── validation/
│   │   └── stripe_customer_validation.feature
│   ├── table_navigation/
│   │   └── stripe_customer_table_and_navigation.feature
│   ├── edge_cases/
│   │   └── stripe_customer_edge_cases.feature
│   ├── boundary/
│   │   └── stripe_customer_input_boundary.feature
│   ├── step_definitions/
│   │   ├── navigation.steps.js
│   │   ├── customer_creation.steps.js
│   │   ├── validation.steps.js
│   │   ├── table_navigation.steps.js
│   │   ├── edge_cases.steps.js
│   │   └── boundary.steps.js
│   └── support/
│       ├── world.js
│       ├── hooks.js
│       └── pages/
│           ├── LoginPage.js
│           └── CustomersPage.js
├── cucumber.config.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js >= 18
- A Stripe test account with test credentials

## Setup

```bash
npm install
npx playwright install chromium
```

## Configuration

Create a `.env` file (never commit this):

```
STRIPE_EMAIL=your_test@email.com
STRIPE_PASSWORD=your_test_password
STRIPE_BASE_URL=https://dashboard.stripe.com
```

## Running Tests

```bash
# Run all tests
npm test

# Run by tag
npm run test:navigation          # CUST-001 to CUST-006
npm run test:happy-path          # CUST-007 to CUST-015
npm run test:validation          # CUST-016 to CUST-020
npm run test:edge-case           # CUST-028 to CUST-032
npm run test:boundary            # CUST-033 to CUST-040

# Run single test case
npx cucumber-js --tags @CUST-007

# Generate HTML report
npm run test:report
```

## Test Coverage

| Feature File | TC IDs | Scenarios | Tags |
|---|---|---|---|
| stripe_customer_navigation.feature | CUST-001-006 | 6 | @navigation @ui @happy-path |
| stripe_customer_creation_happy_path.feature | CUST-007-015 | 9 | @happy-path |
| stripe_customer_validation.feature | CUST-016-020 | 6 | @validation @negative |
| stripe_customer_table_and_navigation.feature | CUST-021-027 | 7 | @navigation @ui |
| stripe_customer_edge_cases.feature | CUST-028-032 | 5 | @edge-case |
| stripe_customer_input_boundary.feature | CUST-033-040 | 10 | @boundary @data-integrity |

## Architecture

- **Page Object Model** - LoginPage and CustomersPage encapsulate all selectors and actions
- **Cucumber World** - shared Playwright browser/context/page instance across steps
- **Hooks** - Before/After setup and teardown with screenshot on failure
- **Tags** - Fine-grained test filtering by TC ID or category
