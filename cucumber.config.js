const { defineConfig } = require('@cucumber/cucumber');

module.exports = defineConfig({
  paths: ['features/**/*.feature'],
  require: ['features/step_definitions/**/*.js', 'features/support/**/*.js'],
  format: ['progress-bar', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
  formatOptions: { snippetInterface: 'async-await' },
  publishQuiet: true,
  parallel: 2
});