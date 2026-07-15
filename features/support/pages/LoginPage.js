'use strict';

class LoginPage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  // Selectors
  get emailInput() { return this.page.locator('input[name="email"], input[type="email"]').first(); }
  get passwordInput() { return this.page.locator('input[name="password"], input[type="password"]').first(); }
  get submitButton() { return this.page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first(); }
  get dashboardIndicator() { return this.page.locator('[data-testid="dashboard"], nav, .DashboardNav, [class*="Nav"]').first(); }

  async navigate() {
    await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle' });
  }

  async login(email, password) {
    await this.navigate();
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailInput.fill(email);

    // Some Stripe login flows have a "Continue" step before password
    const continueBtn = this.page.locator('button:has-text("Continue")');
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click();
      await this.page.waitForTimeout(1000);
    }

    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn() {
    try {
      await this.dashboardIndicator.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { LoginPage };
