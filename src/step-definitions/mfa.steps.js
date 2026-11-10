const { When, Then } = require('@cucumber/cucumber');
const { getNumericOtp, hasConfiguredValue } = require('../utils/test-data');

When('I complete MFA with a valid OTP', { timeout: 5 * 60 * 1000 }, async function () {
  await this.mfaPage.waitForDisplayed();

  if (hasConfiguredValue('MFA_TEST_OTP')) {
    await this.mfaPage.submitOtp(getNumericOtp('MFA_TEST_OTP'));
    return;
  }

  console.info('Manual MFA: enter the current mPass OTP in the browser and click Validate. Waiting for the mailbox.');
  await this.mailboxPage.waitForDisplayed({ timeout: 5 * 60 * 1000 });
});

When('I submit an approved invalid numeric OTP', { timeout: 5 * 60 * 1000 }, async function () {
  await this.mfaPage.waitForDisplayed();

  if (hasConfiguredValue('MFA_INVALID_OTP')) {
    await this.mfaPage.submitOtp(getNumericOtp('MFA_INVALID_OTP'));
    return;
  }

  console.info('Manual MFA: enter an approved invalid numeric test value in the browser and click Validate.');
  await this.mfaPage.waitForInvalidOtpMessage({ timeout: 5 * 60 * 1000 });
});

When('I submit the OTP without a value', async function () {
  await this.mfaPage.submitEmptyOtp();
});

When('I choose Go back to Login from the MFA challenge', async function () {
  await this.mfaPage.goBackToLogin();
});

Then('the empty OTP validation message is displayed', async function () {
  await this.mfaPage.waitForEmptyOtpMessage();
});

Then('the invalid OTP validation message is displayed', async function () {
  await this.mfaPage.waitForInvalidOtpMessage();
});

Then('the mailbox is displayed', async function () {
  await this.mailboxPage.waitForDisplayed();
});
