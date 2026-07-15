'use strict';
const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class StripeWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseUrl = process.env.STRIPE_BASE_URL || 'https://dashboard.stripe.com';
    this.stripeEmail = process.env.STRIPE_EMAIL || '';
    this.stripePassword = process.env.STRIPE_PASSWORD || '';
    // Shared state across steps
    this.lastCreatedCustomerName = null;
    this.lastCreatedCustomerEmail = null;
    this.customerTableCountBefore = 0;
  }

  async openBrowser() {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOW_MO || '0')
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: true
    });
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  async takeScreenshot(name) {
    if (this.page) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  }
}

setWorldConstructor(StripeWorld);
module.exports = { StripeWorld };
