const { Given, When, Then } = require('@cucumber/cucumber');
const { getCredentials } = require('../utils/test-data');

Given('I open the OWA login page', async function () {
  await this.loginPage.open();
});

When('I sign in with the configured credentials', async function () {
  const { username, password } = getCredentials();
  await this.loginPage.signIn(username, password);
});

Then('the login form is displayed', async function () {
  await this.loginPage.waitForDisplayed();
});

Then('the MFA challenge is displayed', async function () {
  await this.mfaPage.waitForDisplayed();
});
