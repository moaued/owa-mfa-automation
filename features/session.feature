@regression
Feature: OWA session behavior
  As an OWA user
  I want to end my session and be returned to sign-in
  So that mailbox access does not persist after logout

  @security @mfa
  Scenario: Logout and post-logout navigation require sign-in
    Given I open the OWA login page
    When I sign in with the configured credentials
    And I complete MFA with a valid OTP
    And I sign out of the mailbox
    Then the login form is displayed
    When I open the OWA base URL
    Then the login form is displayed
    When I use browser Back
    Then the login form is displayed
