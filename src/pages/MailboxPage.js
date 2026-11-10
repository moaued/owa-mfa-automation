class MailboxPage {
  constructor(page, baseUrl, loginPage) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.loginPage = loginPage;
    this.mailbox = page.getByRole('main', { name: 'Mail' });
    this.accountMenuButton = page.getByRole('button', { name: /menu with submenu$/ });
    this.signOutMenuItem = page.getByRole('menuitem', { name: 'Sign out', exact: true });
  }

  async waitForDisplayed(options = {}) {
    await this.mailbox.waitFor({ state: 'visible', ...options });
  }

  async signOut() {
    await this.accountMenuButton.click();
    await this.signOutMenuItem.click();
    await this.loginPage.waitForDisplayed();
  }

  async openBaseUrl() {
    await this.page.goto(this.baseUrl);
    await this.loginPage.waitForDisplayed();
  }

  async goBack() {
    await this.page.goBack();
    await this.loginPage.waitForDisplayed();
  }
}

module.exports = { MailboxPage };
