class LoginPage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.usernameInput = page.getByRole('textbox', { name: 'Domain\\user name:' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password:' });
    this.signInButton = page.getByRole('button', { name: 'sign in', exact: true });
  }

  async open() {
    await this.page.goto(this.baseUrl);
    await this.waitForDisplayed();
  }

  async signIn(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async waitForDisplayed() {
    await Promise.all([
      this.usernameInput.waitFor({ state: 'visible' }),
      this.passwordInput.waitFor({ state: 'visible' })
    ]);
  }
}

module.exports = { LoginPage };
