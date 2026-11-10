const fs = require('node:fs');
const path = require('node:path');
const { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { LoginPage } = require('../pages/LoginPage');
const { MfaPage } = require('../pages/MfaPage');
const { MailboxPage } = require('../pages/MailboxPage');
const { getBaseUrl } = require('../utils/test-data');

setDefaultTimeout(30_000);

let browser;

BeforeAll(async function () {
  const manualOtpRequired = ['MFA_TEST_OTP', 'MFA_INVALID_OTP']
    .some(name => !process.env[name]?.trim());
  const headless = manualOtpRequired ? false : process.env.HEADLESS !== 'false';
  browser = await chromium.launch({ headless });
});

Before(async function () {
  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  const baseUrl = getBaseUrl();

  this.loginPage = new LoginPage(this.page, baseUrl);
  this.mfaPage = new MfaPage(this.page);
  this.mailboxPage = new MailboxPage(this.page, baseUrl, this.loginPage);
});

After(async function ({ pickle, result }) {
  try {
    if (result?.status === Status.FAILED && this.page) {
      const fileName = `${pickle.name.replace(/[^a-z0-9-]/gi, '-')}-${Date.now()}.png`;
      const screenshotPath = path.resolve('screenshots', fileName);
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
      const screenshot = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
        mask: [this.page.locator('input[name="username"], input[type="password"], input[type="number"]')]
      });
      await this.attach(screenshot, 'image/png');
    }
  } finally {
    if (this.context) {
      await this.context.close();
    }
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
