'use strict';

class CustomersPage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  // ── Navigation Selectors ────────────────────────────────────────────────
  get customersNavLink() {
    return this.page.locator('nav a:has-text("Customers"), [data-testid="nav-customers"], a[href*="/customers"]').first();
  }

  get pageHeading() {
    return this.page.locator('h1, h2, [data-testid="page-title"]').first();
  }

  // ── Customer Table Selectors ────────────────────────────────────────────
  get customerTable() {
    return this.page.locator('table, [data-testid="customer-table"], [class*="CustomerTable"]');
  }

  get customerTableRows() {
    return this.page.locator('table tbody tr, [data-testid="customer-row"], [class*="TableRow"]');
  }

  // ── Add Customer Button ─────────────────────────────────────────────────
  get addCustomerButton() {
    return this.page.locator('button:has-text("Add customer"), [data-testid="add-customer-btn"]').first();
  }

  // ── Modal Selectors ─────────────────────────────────────────────────────
  get modal() {
    return this.page.locator('[role="dialog"], [data-testid="add-customer-modal"], [class*="Modal"]').first();
  }

  get modalNameInput() {
    return this.page.locator('[role="dialog"] input[name="name"], [role="dialog"] input[placeholder*="Name"], [role="dialog"] input[placeholder*="name"]').first();
  }

  get modalEmailInput() {
    return this.page.locator('[role="dialog"] input[name="email"], [role="dialog"] input[type="email"], [role="dialog"] input[placeholder*="email"]').first();
  }

  get modalLanguageSelect() {
    return this.page.locator('[role="dialog"] select[name="language"], [role="dialog"] [data-testid="language-select"]').first();
  }

  get modalSubmitButton() {
    return this.page.locator('[role="dialog"] button:has-text("Add customer"), [role="dialog"] button[type="submit"]').first();
  }

  get modalCloseButton() {
    return this.page.locator('[role="dialog"] button[aria-label="Close"], [role="dialog"] button:has-text("Cancel"), [role="dialog"] [data-testid="modal-close"]').first();
  }

  // ── Customer Details Page Selectors ─────────────────────────────────────
  get customerDetailsName() {
    return this.page.locator('[data-testid="customer-name"], h1, h2, [class*="CustomerName"]').first();
  }

  get customerDetailsEmail() {
    return this.page.locator('[data-testid="customer-email"], [class*="CustomerEmail"]').first();
  }

  get customerDetailsLanguage() {
    return this.page.locator('[data-testid="customer-language"], [class*="Language"]').first();
  }

  get billingSection() {
    return this.page.locator('[data-testid="billing-section"], [class*="BillingInfo"], section:has-text("Billing")').first();
  }

  get taxSection() {
    return this.page.locator('[data-testid="tax-section"], [class*="TaxInfo"], section:has-text("Tax")').first();
  }

  get shippingSection() {
    return this.page.locator('[data-testid="shipping-section"], [class*="ShippingInfo"], section:has-text("Shipping")').first();
  }

  get invoiceSection() {
    return this.page.locator('[data-testid="invoice-section"], [class*="InvoiceSettings"], section:has-text("Invoice")').first();
  }

  // ── Validation Error Selectors ──────────────────────────────────────────
  get nameValidationError() {
    return this.page.locator('[role="dialog"] [data-testid="name-error"], [role="dialog"] .error:near(input[name="name"]), [role="dialog"] [class*="FieldError"]:near(input[name="name"])').first();
  }

  get emailValidationError() {
    return this.page.locator('[role="dialog"] [data-testid="email-error"], [role="dialog"] .error:near(input[type="email"]), [role="dialog"] [class*="FieldError"]:near(input[type="email"])').first();
  }

  // ── Actions ─────────────────────────────────────────────────────────────

  async navigateToCustomers() {
    await this.page.goto(`${this.baseUrl}/customers`, { waitUntil: 'networkidle' });
  }

  async clickCustomersInNav() {
    await this.customersNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddCustomer() {
    await this.addCustomerButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addCustomerButton.click();
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillCustomerName(name) {
    await this.modalNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.modalNameInput.clear();
    await this.modalNameInput.fill(name);
  }

  async fillCustomerEmail(email) {
    await this.modalEmailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.modalEmailInput.clear();
    await this.modalEmailInput.fill(email);
  }

  async submitCustomerForm() {
    await this.modalSubmitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async closeModal() {
    await this.modalCloseButton.click();
    await this.page.waitForTimeout(500);
  }

  async createCustomer(name, email) {
    await this.clickAddCustomer();
    await this.fillCustomerName(name);
    await this.fillCustomerEmail(email);
    await this.submitCustomerForm();
  }

  async fillBillingInfo(billingData) {
    // Expand billing section if collapsed
    const billingToggle = this.page.locator('[role="dialog"] button:has-text("Billing"), [role="dialog"] [data-testid="billing-toggle"]').first();
    if (await billingToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await billingToggle.click();
    }
    if (billingData['Address Line 1']) {
      const addressInput = this.page.locator('[role="dialog"] input[name*="address"], [role="dialog"] input[placeholder*="Address"]').first();
      await addressInput.fill(billingData['Address Line 1']);
    }
    if (billingData['City']) {
      const cityInput = this.page.locator('[role="dialog"] input[name*="city"], [role="dialog"] input[placeholder*="City"]').first();
      await cityInput.fill(billingData['City']);
    }
    if (billingData['Postal Code']) {
      const zipInput = this.page.locator('[role="dialog"] input[name*="postal"], [role="dialog"] input[name*="zip"], [role="dialog"] input[placeholder*="ZIP"]').first();
      await zipInput.fill(billingData['Postal Code']);
    }
  }

  async fillTaxInfo(taxData) {
    const taxToggle = this.page.locator('[role="dialog"] button:has-text("Tax"), [role="dialog"] [data-testid="tax-toggle"]').first();
    if (await taxToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await taxToggle.click();
    }
    if (taxData['Tax ID']) {
      const taxIdInput = this.page.locator('[role="dialog"] input[name*="tax"], [role="dialog"] input[placeholder*="tax"]').first();
      await taxIdInput.fill(taxData['Tax ID']);
    }
  }

  async fillShippingInfo(shippingData) {
    const shippingToggle = this.page.locator('[role="dialog"] button:has-text("Shipping"), [role="dialog"] [data-testid="shipping-toggle"]').first();
    if (await shippingToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await shippingToggle.click();
    }
    if (shippingData['Address Line 1']) {
      const addressInput = this.page.locator('[role="dialog"] input[name*="shipping_address"], [role="dialog"] input[placeholder*="Shipping"]').first();
      await addressInput.fill(shippingData['Address Line 1']);
    }
  }

  async getCustomerRowCount() {
    await this.customerTableRows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.customerTableRows.count();
  }

  async findCustomerInTable(name) {
    const rows = this.page.locator(`table tbody tr:has-text("${name}"), [data-testid="customer-row"]:has-text("${name}")`);
    return rows;
  }

  async clickCustomerRow(name) {
    const row = this.page.locator(`table tbody tr:has-text("${name}"), [data-testid="customer-row"]:has-text("${name}")`).first();
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isModalOpen() {
    return await this.modal.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async isModalClosed() {
    return await this.modal.isHidden({ timeout: 3000 }).catch(() => true);
  }

  async getCustomerDetailsText(selector) {
    try {
      const el = this.page.locator(selector).first();
      return await el.textContent({ timeout: 5000 });
    } catch {
      return '';
    }
  }

  async isAddCustomerButtonVisible() {
    return await this.addCustomerButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async isAddCustomerButtonEnabled() {
    return await this.addCustomerButton.isEnabled({ timeout: 5000 }).catch(() => false);
  }

  async getNameFieldValue() {
    return await this.modalNameInput.inputValue().catch(() => '');
  }

  async getEmailFieldValue() {
    return await this.modalEmailInput.inputValue().catch(() => '');
  }

  async getLanguageFieldText() {
    try {
      const select = this.modalLanguageSelect;
      const selected = await select.evaluate(el => {
        if (el.tagName === 'SELECT') return el.options[el.selectedIndex]?.text;
        return el.textContent;
      });
      return selected || '';
    } catch {
      // Try combobox pattern
      const combobox = this.page.locator('[role="dialog"] [role="combobox"], [role="dialog"] [aria-label*="language"]').first();
      return await combobox.textContent({ timeout: 3000 }).catch(() => '');
    }
  }
}

module.exports = { CustomersPage };
