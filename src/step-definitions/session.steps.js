const { When, Then } = require('@cucumber/cucumber');

When('I sign out of the mailbox', async function () {
  await this.mailboxPage.signOut();
});

When('I open the OWA base URL', async function () {
  await this.mailboxPage.openBaseUrl();
});

When('I use browser Back', async function () {
  await this.mailboxPage.goBack();
});
