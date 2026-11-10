@mfa @regression
Feature: OWA multi-factor authentication
  As an OWA user
  I want to verify the OTP from the mPass mobile application
  So that only a validated sign-in reaches my mailbox

  Scenario: Empty OTP is rejected
    Given I open the OWA login page
    When I sign in with the configured credentials
    And I submit the OTP without a value
    Then the empty OTP validation message is displayed

  Scenario: A valid OTP grants mailbox access
    Given I open the OWA login page
    When I sign in with the configured credentials
    And I complete MFA with a valid OTP
    Then the mailbox is displayed

  Scenario: An approved invalid numeric OTP is rejected
    Given I open the OWA login page
    When I sign in with the configured credentials
    And I submit an approved invalid numeric OTP
    Then the invalid OTP validation message is displayed

  Scenario: The MFA challenge can return to Login
    Given I open the OWA login page
    When I sign in with the configured credentials
    And I choose Go back to Login from the MFA challenge
    Then the login form is displayed
