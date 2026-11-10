const { World, setWorldConstructor } = require('@cucumber/cucumber');

class OwaWorld extends World {
  constructor(options) {
    super(options);
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.loginPage = undefined;
    this.mfaPage = undefined;
    this.mailboxPage = undefined;
  }
}

setWorldConstructor(OwaWorld);

module.exports = { OwaWorld };
