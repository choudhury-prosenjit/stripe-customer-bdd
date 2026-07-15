'use strict';
const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ── CUST-016 ────────────────────────────────────────────────────────────────

When('I leave the customer name field blank', async function () {
  const nameInput = this.customersPage.modalNameInput;
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
  await nameInput.clear();
});

When('I leave the email field blank', async function () {
  const emailInput = this.customersPage.modalEmailInput;
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await emailInput.clear();
});

Then('the customer is not created', async function () {
  await this.page.waitForTimeout(1500);
  const isModalOpen = await this.customersPage.isModalOpen();
  expect(isModalOpen).toBe(true);
});

Then('a validation message is displayed for the name field', async function () {
  const modal = this.customersPage.modal;
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  const errorLocator = this.page.locator(
    '[role="dialog"] [class*="error"], [role="dialog"] [class*="Error"], ' +
    '[role="dialog"] [class*="invalid"], [role="dialog"] [aria-invalid="true"], ' +
    '[role="dialog"] p[class*="help"]'
  ).first();
  const isVisible = await errorLocator.isVisible({ timeout: 5000 }).catch(() => false);
  expect(isVisible).toBe(true);
});

Then('a validation message is displayed for the email field', async function () {
  const modal = this.customersPage.modal;
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  const errorLocator = this.page.locator(
    '[role="dialog"] [class*="error"], [role="dialog"] [class*="Error"], ' +
    '[role="dialog"] [class*="invalid"], [role="dialog"] [aria-invalid="true"]'
  ).first();
  const isVisible = await errorLocator.isVisible({ timeout: 5000 }).catch(() => false);
  expect(isVisible).toBe(true);
});

Then('the modal remains open', async function () {
  const isOpen = await this.customersPage.isModalOpen();
  expect(isOpen).toBe(true);
});

// ── CUST-017 ────────────────────────────────────────────────────────────────

When('I enter a customer name {string}', async function (name) {
  this.lastCreatedCustomerName = name;
  await this.customersPage.fillCustomerName(name);
});

// ── CUST-018 ────────────────────────────────────────────────────────────────

When('I enter an invalid email format {string}', async function (email) {
  await this.customersPage.fillCustomerEmail(email);
});

When('I enter an invalid email {string}', async function (email) {
  await this.customersPage.fillCustomerEmail(email);
});

Then('an invalid email format validation message is displayed', async function () {
  const errorLocator = this.page.locator(
    '[role="dialog"] [class*="error"], [role="dialog"] [class*="Error"], [role="dialog"] [aria-invalid="true"]'
  ).first();
  const isVisible = await errorLocator.isVisible({ timeout: 5000 }).catch(() => false);
  expect(isVisible).toBe(true);
});

Then('an invalid email validation message is displayed', async function () {
  const errorLocator = this.page.locator(
    '[role="dialog"] [class*="error"], [role="dialog"] [class*="Error"], [role="dialog"] [aria-invalid="true"]'
  ).first();
  const isVisible = await errorLocator.isVisible({ timeout: 5000 }).catch(() => false);
  expect(isVisible).toBe(true);
});

// ── CUST-020 ────────────────────────────────────────────────────────────────

Then('a validation error is displayed for the email field', async function () {
  const errorLocator = this.page.locator(
    '[role="dialog"] [class*="error"], [role="dialog"] [aria-invalid="true"]'
  ).first();
  const isVisible = await errorLocator.isVisible({ timeout: 5000 }).catch(() => false);
  expect(isVisible).toBe(true);
});

Then('the customer name field still contains {string}', async function (expectedName) {
  const nameValue = await this.customersPage.getNameFieldValue();
  expect(nameValue).toContain(expectedName);
});

Then('the modal remains open with previously entered data intact', async function () {
  const isOpen = await this.customersPage.isModalOpen();
  expect(isOpen).toBe(true);
  const nameValue = await this.customersPage.getNameFieldValue();
  expect(nameValue.length).toBeGreaterThan(0);
});
