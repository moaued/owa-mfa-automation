class MfaPage {
  constructor(page) {
    this.page = page;
    this.challengeMessage = page.getByText('Please enter OTP generated via mobile app', { exact: true });
    this.otpInput = page.locator('input[type="number"]');
    this.validateButton = page.getByRole('button', { name: 'Validate', exact: true });
    this.backToLoginButton = page.getByRole('button', { name: 'Go back to Login', exact: true });
  }

  async waitForDisplayed() {
    await Promise.all([
      this.challengeMessage.waitFor({ state: 'visible' }),
      this.otpInput.waitFor({ state: 'visible' })
    ]);
  }

  async submitOtp(otp) {
    await this.otpInput.fill(otp);
    await this.validateButton.click();
  }

  async submitEmptyOtp() {
    await this.validateButton.click();
  }

  async goBackToLogin() {
    await this.backToLoginButton.click();
  }

  async waitForEmptyOtpMessage() {
    await this.page.getByText('OTP. It cannot be empty.', { exact: true }).waitFor({ state: 'visible' });
  }

  async waitForInvalidOtpMessage(options = {}) {
    await this.page.getByText('Invalid OTP entered. Please check the value and try again.', { exact: true }).waitFor({ state: 'visible', ...options });
  }
}

module.exports = { MfaPage };
