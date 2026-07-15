'use strict';
const { Before, After, AfterStep, Status } = require('@cucumber/cucumber');
const { LoginPage } = require('./pages/LoginPage');
const { CustomersPage } = require('./pages/CustomersPage');

Before(async function (scenario) {
  await this.openBrowser();
  this.loginPage = new LoginPage(this.page, this.baseUrl);
  this.customersPage = new CustomersPage(this.page, this.baseUrl);
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    await this.takeScreenshot(`FAILED-${scenario.pickle.name}`);
  }
  await this.closeBrowser();
});
