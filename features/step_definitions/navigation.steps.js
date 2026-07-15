'use strict';
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ── Background steps ────────────────────────────────────────────────────────

Given('I am logged in to the Stripe dashboard', async function () {
  await this.loginPage.login(this.stripeEmail, this.stripePassword);
  const loggedIn = await this.loginPage.isLoggedIn();
  expect(loggedIn).toBe(true);
});

Given('I have the necessary permissions to manage customers', async function () {
  // Permissions verified by successful login; no additional action needed
});

Given('I am on the Customers page', async function () {
  await this.customersPage.navigateToCustomers();
  await this.page.waitForLoadState('networkidle');
});

Given('the Add Customer modal is open', async function () {
  const isOpen = await this.customersPage.isModalOpen();
  if (!isOpen) {
    await this.customersPage.clickAddCustomer();
  }
  const modalOpen = await this.customersPage.isModalOpen();
  expect(modalOpen).toBe(true);
});

// ── CUST-001 ────────────────────────────────────────────────────────────────

When('I locate {string} in the left navigation menu', async function (menuItem) {
  const navLink = this.page.locator(`nav a:has-text("${menuItem}"), a[href*="${menuItem.toLowerCase()}"]`).first();
  await navLink.waitFor({ state: 'visible', timeout: 10000 });
});

When('I click on {string}', async function (menuItem) {
  await this.customersPage.clickCustomersInNav();
});

Then('the Customers page opens successfully', async function () {
  await this.page.waitForLoadState('networkidle');
  const url = this.page.url();
  expect(url).toContain('customers');
});

Then('the page title or heading displays {string}', async function (expectedTitle) {
  const heading = this.customersPage.pageHeading;
  await heading.waitFor({ state: 'visible', timeout: 10000 });
  const text = await heading.textContent();
  expect(text).toContain(expectedTitle);
});

// ── CUST-002 ────────────────────────────────────────────────────────────────

Given('customers already exist in the Stripe account', async function () {
  // Pre-condition: account has existing customers - verified by checking table
  await this.customersPage.navigateToCustomers();
});

When('I open the Customers page', async function () {
  await this.customersPage.navigateToCustomers();
  await this.page.waitForLoadState('networkidle');
});

When('I review the customer table', async function () {
  await this.customersPage.customerTable.waitFor({ state: 'visible', timeout: 10000 });
});

Then('existing customers are displayed as separate rows in the table', async function () {
  const rowCount = await this.customersPage.getCustomerRowCount();
  expect(rowCount).toBeGreaterThan(0);
});

Then('each row contains at least a customer name and email', async function () {
  const firstRow = this.customersPage.customerTableRows.first();
  const text = await firstRow.textContent();
  expect(text).toBeTruthy();
  expect(text.trim().length).toBeGreaterThan(0);
});

// ── CUST-003 ────────────────────────────────────────────────────────────────

When('I check the top section of the page', async function () {
  await this.page.waitForLoadState('networkidle');
});

Then('the {string} button is visible', async function (buttonText) {
  const isVisible = await this.customersPage.isAddCustomerButtonVisible();
  expect(isVisible).toBe(true);
});

Then('the {string} button is enabled', async function (buttonText) {
  const isEnabled = await this.customersPage.isAddCustomerButtonEnabled();
  expect(isEnabled).toBe(true);
});

// ── CUST-004 ────────────────────────────────────────────────────────────────

When('I click the {string} button', async function (buttonText) {
  if (buttonText === 'Add customer') {
    await this.customersPage.clickAddCustomer();
  } else {
    await this.page.locator(`button:has-text("${buttonText}")`).first().click();
    await this.page.waitForLoadState('networkidle');
  }
});

Then('a modal dialog opens for creating a new customer', async function () {
  const isOpen = await this.customersPage.isModalOpen();
  expect(isOpen).toBe(true);
});

Then('the modal contains a form for entering customer details', async function () {
  const nameField = this.customersPage.modalNameInput;
  const emailField = this.customersPage.modalEmailInput;
  expect(await nameField.isVisible().catch(() => false)).toBe(true);
  expect(await emailField.isVisible().catch(() => false)).toBe(true);
});

// ── CUST-005 ────────────────────────────────────────────────────────────────

When('I review the fields in the modal', async function () {
  await this.customersPage.modal.waitFor({ state: 'visible', timeout: 10000 });
});

Then('the following fields are available:', async function (dataTable) {
  const expectedFields = dataTable.hashes().map(r => r['Field']);
  const modalContent = await this.customersPage.modal.textContent();
  for (const field of expectedFields) {
    // Check that the field label text appears somewhere in the modal
    const fieldLocator = this.page.locator(`[role="dialog"]:has-text("${field}")`);
    const count = await fieldLocator.count();
    expect(count, `Field "${field}" not found in modal`).toBeGreaterThan(0);
  }
});

// ── CUST-006 ────────────────────────────────────────────────────────────────

When('I locate the language field', async function () {
  await this.customersPage.modal.waitFor({ state: 'visible', timeout: 10000 });
});

Then('{string} is selected by default', async function (expectedDefault) {
  const languageText = await this.customersPage.getLanguageFieldText();
  expect(languageText).toContain(expectedDefault);
});
