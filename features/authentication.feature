@regression
Feature: OWA authentication
  As an OWA user
  I want to sign in with my credentials
  So that I can continue to MFA verification

  @smoke
  Scenario: Login page presents the credential form
    Given I open the OWA login page
    Then the login form is displayed

  @mfa
  Scenario: Valid credentials open the MFA challenge
    Given I open the OWA login page
    When I sign in with the configured credentials
    Then the MFA challenge is displayed
