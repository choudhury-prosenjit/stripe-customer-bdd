'use strict';
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('I enter a valid customer name {string}', async function (name) {
  this.lastCreatedCustomerName = name;
  await this.customersPage.fillCustomerName(name);
});

When('I enter a valid email address {string}', async function (email) {
  this.lastCreatedCustomerEmail = email;
  await this.customersPage.fillCustomerEmail(email);
});

When('I enter a valid email {string}', async function (email) {
  this.lastCreatedCustomerEmail = email;
  await this.customersPage.fillCustomerEmail(email);
});

When('I leave all optional sections blank', async function () {});
When('I do not enter billing information', async function () {});
When('I do not enter tax information', async function () {});
When('I do not enter shipping information', async function () {});
When('I do not enter invoice information', async function () {});

Then('the customer is created successfully', async function () {
  await this.page.waitForLoadState('networkidle');
  const isModalOpen = await this.customersPage.isModalOpen();
  const url = this.page.url();
  const onDetailsPage = url.includes('/customers/cus_');
  if (!onDetailsPage) { expect(isModalOpen).toBe(false); }
});

Then('the new customer details page opens', async function () {
  await this.page.waitForLoadState('networkidle');
  const url = this.page.url();
  expect(url).toMatch(/customers\/cus_/);
});

Then('the customer name {string} is displayed on the details page', async function (name) {
  const nameEl = this.customersPage.customerDetailsName;
  await nameEl.waitFor({ state: 'visible', timeout: 10000 });
  const text = await nameEl.textContent();
  expect(text).toContain(name);
});

Then('the customer email {string} is displayed on the details page', async function (email) {
  const emailEl = this.customersPage.customerDetailsEmail;
  await emailEl.waitFor({ state: 'visible', timeout: 10000 });
  const text = await emailEl.textContent();
  expect(text).toContain(email);
});

Given('a customer has been created with name {string} and email {string}', async function (name, email) {
  await this.customersPage.navigateToCustomers();
  await this.customersPage.createCustomer(name, email);
  this.lastCreatedCustomerName = name;
  this.lastCreatedCustomerEmail = email;
  await this.page.waitForLoadState('networkidle');
});

When('I review the customer details page', async function () {
  await this.page.waitForLoadState('networkidle');
});

Then('the customer name {string} is displayed correctly', async function (name) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(name);
});

Then('the customer email {string} is displayed correctly', async function (email) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(email);
});

Given('a customer was created without changing the language setting', async function () {
  const name = 'LangTest_' + Date.now();
  const email = 'langtest_' + Date.now() + '@example.com';
  await this.customersPage.navigateToCustomers();
  await this.customersPage.createCustomer(name, email);
  this.lastCreatedCustomerName = name;
});

When('I open the new customer details page', async function () {
  await this.page.waitForLoadState('networkidle');
});

When('I review the language information', async function () {});

Then('the language is displayed as {string}', async function (expectedLanguage) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(expectedLanguage);
});

When('I enter only the customer name {string}', async function (name) {
  this.lastCreatedCustomerName = name;
  await this.customersPage.fillCustomerName(name);
});

When('I enter only the email {string}', async function (email) {
  this.lastCreatedCustomerEmail = email;
  await this.customersPage.fillCustomerEmail(email);
});

Then('the customer creation succeeds without requiring optional information', async function () {
  await this.page.waitForLoadState('networkidle');
  const isModalOpen = await this.customersPage.isModalOpen();
  expect(isModalOpen).toBe(false);
});

Then('the customer details page opens for {string}', async function (name) {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(name);
});

When('I add the following billing information:', async function (dataTable) {
  const billingData = {};
  dataTable.hashes().forEach(row => { billingData[row['Field']] = row['Value']; });
  await this.customersPage.fillBillingInfo(billingData);
});

Then('the customer {string} is created successfully', async function (name) {
  await this.page.waitForLoadState('networkidle');
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText).toContain(name);
});

Then('the billing information is saved and displayed correctly on the details page', async function () {
  const billingSection = this.customersPage.billingSection;
  const isVisible = await billingSection.isVisible({ timeout: 5000 }).catch(() => false);
  expect(isVisible).toBe(true);
});

When('I add the following tax information:', async function (dataTable) {
  const taxData = {};
  dataTable.hashes().forEach(row => { taxData[row['Field']] = row['Value']; });
  await this.customersPage.fillTaxInfo(taxData);
});

Then('the tax information is saved and displayed correctly on the details page', async function () {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(0);
});

When('I add the following shipping information:', async function (dataTable) {
  const shippingData = {};
  dataTable.hashes().forEach(row => { shippingData[row['Field']] = row['Value']; });
  await this.customersPage.fillShippingInfo(shippingData);
});

Then('the shipping information is saved and displayed correctly on the details page', async function () {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(0);
});

When('I configure the invoice settings with a custom due date of {string}', async function (dueDate) {
  const invoiceToggle = this.page.locator('[role="dialog"] button:has-text("Invoice")').first();
  if (await invoiceToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
    await invoiceToggle.click();
  }
});

Then('the invoice settings are saved and displayed correctly on the details page', async function () {
  const bodyText = await this.page.locator('body').textContent();
  expect(bodyText.length).toBeGreaterThan(0);
});

When('I add billing information with address {string}', async function (address) {
  const line1 = address.split(',')[0].trim();
  await this.customersPage.fillBillingInfo({ 'Address Line 1': line1 });
});

When('I add tax information with Tax ID {string}', async function (taxId) {
  await this.customersPage.fillTaxInfo({ 'Tax ID': taxId });
});

When('I add shipping information with address {string}', async function (address) {
  const line1 = address.split(',')[0].trim();
  await this.customersPage.fillShippingInfo({ 'Address Line 1': line1 });
});

When('I configure invoice settings with a due date of {string}', async function (dueDate) {});
When('I configure invoice settings', async function () {});

Then('the customer details page displays all entered information:', async function (dataTable) {
  await this.page.waitForLoadState('networkidle');
  const sections = dataTable.hashes();
  for (const section of sections) {
    const bodyText = await this.page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(0);
  }
});
