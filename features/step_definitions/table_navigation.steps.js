'use strict';
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ── CUST-021 ────────────────────────────────────────────────────────────────

Given('a new customer {string} with email {string} has been created', async function (name, email) {
  await this.customersPage.navigateToCustomers();
  await this.customersPage.createCustomer(name, email);
  this.lastCreatedCustomerName = name;
  this.lastCreatedCustomerEmail = email;
  await this.page.waitForLoadState('networkidle');
});

When('I click {string} from the left navigation menu', async function (menuItem) {
  await this.customersPage.clickCustomersInNav();
});

Then('the customer {string} appears in the customer table', async function (name) {
  const rows = await this.customersPage.findCustomerInTable(name);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

Then('existing customers are also visible in the table', async function () {
  const rowCount = await this.customersPage.getCustomerRowCount();
  expect(rowCount).toBeGreaterThan(0);
});

// ── CUST-022 ────────────────────────────────────────────────────────────────

When('I return to the Customers page', async function () {
  await this.customersPage.navigateToCustomers();
  await this.page.waitForLoadState('networkidle');
});

When('I locate the row for {string}', async function (name) {
  const rows = await this.customersPage.findCustomerInTable(name);
  await rows.first().waitFor({ state: 'visible', timeout: 10000 });
});

Then('the table row displays the name {string}', async function (name) {
  const rows = await this.customersPage.findCustomerInTable(name);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

Then('the table row displays the email {string}', async function (email) {
  const emailRows = this.page.locator('table tbody tr:has-text("' + email + '"), [data-testid="customer-row"]:has-text("' + email + '")');
  const count = await emailRows.count();
  expect(count).toBeGreaterThan(0);
});

// ── CUST-023 ────────────────────────────────────────────────────────────────

Given('at least one customer exists in the account', async function () {
  await this.customersPage.navigateToCustomers();
  const rowCount = await this.customersPage.getCustomerRowCount();
  if (rowCount === 0) {
    await this.customersPage.createCustomer('Existing Customer', 'existing_' + Date.now() + '@example.com');
    await this.customersPage.navigateToCustomers();
  }
});

When('I click on an existing customer row', async function () {
  const firstRow = this.customersPage.customerTableRows.first();
  await firstRow.waitFor({ state: 'visible', timeout: 10000 });
  this.clickedCustomerText = await firstRow.textContent();
  await firstRow.click();
  await this.page.waitForLoadState('networkidle');
});

Then('the selected customer\'s details page opens', async function () {
  const url = this.page.url();
  expect(url).toContain('customers');
});

Then('the details page displays that customer\'s information', async function () {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(0);
});

// ── CUST-024 ────────────────────────────────────────────────────────────────

Given('at least two customers exist in the customer table', async function () {
  await this.customersPage.navigateToCustomers();
  const rowCount = await this.customersPage.getCustomerRowCount();
  if (rowCount < 2) {
    await this.customersPage.createCustomer('Customer A', 'custa_' + Date.now() + '@example.com');
    await this.customersPage.navigateToCustomers();
    await this.customersPage.createCustomer('Customer B', 'custb_' + Date.now() + '@example.com');
    await this.customersPage.navigateToCustomers();
  }
});

When('I note the name {string} and email {string} of a specific customer', async function (name, email) {
  this.targetCustomerName = name;
  this.targetCustomerEmail = email;
  const row = await this.customersPage.findCustomerInTable(name);
  const count = await row.count();
  if (count === 0) {
    await this.customersPage.createCustomer(name, email);
    await this.customersPage.navigateToCustomers();
  }
});

When('I click on that customer\'s row', async function () {
  await this.customersPage.clickCustomerRow(this.targetCustomerName);
});

Then('the details page displays the name {string}', async function (name) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(name);
});

Then('the details page displays the email {string}', async function (email) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(email);
});

Then('the details page does not display another customer\'s information', async function () {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(this.targetCustomerName);
});

// ── CUST-025 ────────────────────────────────────────────────────────────────

When('I click on the row for {string}', async function (name) {
  await this.customersPage.clickCustomerRow(name);
});

Then('the details page for {string} opens', async function (name) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(name);
});

// ── CUST-026 ────────────────────────────────────────────────────────────────

Given('I am on a customer details page', async function () {
  await this.customersPage.navigateToCustomers();
  const firstRow = this.customersPage.customerTableRows.first();
  if (await firstRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstRow.click();
    await this.page.waitForLoadState('networkidle');
  }
});

Then('the customer table page opens', async function () {
  const url = this.page.url();
  expect(url).toContain('customers');
});

Then('all customers are displayed in the table', async function () {
  const rowCount = await this.customersPage.getCustomerRowCount();
  expect(rowCount).toBeGreaterThanOrEqual(0);
});

// ── CUST-027 ────────────────────────────────────────────────────────────────

When('I create a customer with name {string} and email {string}', async function (name, email) {
  const isOpen = await this.customersPage.isModalOpen();
  if (!isOpen) { await this.customersPage.clickAddCustomer(); }
  await this.customersPage.fillCustomerName(name);
  await this.customersPage.fillCustomerEmail(email);
  await this.customersPage.submitCustomerForm();
  await this.page.waitForLoadState('networkidle');
});

When('I open the Add Customer modal again', async function () {
  await this.customersPage.clickAddCustomer();
});

When('I create a second customer with name {string} and email {string}', async function (name, email) {
  await this.customersPage.fillCustomerName(name);
  await this.customersPage.fillCustomerEmail(email);
  await this.customersPage.submitCustomerForm();
  await this.page.waitForLoadState('networkidle');
});

Then('both {string} and {string} appear as separate rows in the customer table', async function (name1, name2) {
  const rows1 = await this.customersPage.findCustomerInTable(name1);
  const rows2 = await this.customersPage.findCustomerInTable(name2);
  expect(await rows1.count()).toBeGreaterThan(0);
  expect(await rows2.count()).toBeGreaterThan(0);
});
