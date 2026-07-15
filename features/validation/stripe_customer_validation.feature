@stripe @customers @validation @negative
Feature: Stripe Customer Creation - Field Validation
  As a Stripe dashboard user
  I want the system to validate required fields and input formats
  So that invalid customer data is rejected with clear feedback

  Background:
    Given I am logged in to the Stripe dashboard
    And I am on the Customers page
    And the Add Customer modal is open

  @CUST-016
  Scenario: CUST-016 - Verify customer name is a required field
    When I leave the customer name field blank
    And I enter a valid email "valid@example.com"
    And I click the "Add customer" button
    Then the customer is not created
    And a validation message is displayed for the name field
    And the modal remains open

  @CUST-017
  Scenario: CUST-017 - Verify customer email is a required field
    When I enter a customer name "Test User"
    And I leave the email field blank
    And I click the "Add customer" button
    Then the customer is not created
    And a validation message is displayed for the email field
    And the modal remains open

  @CUST-018
  Scenario: CUST-018 - Verify invalid email format is rejected
    When I enter a customer name "Test User"
    And I enter an invalid email format "not-a-valid-email"
    And I click the "Add customer" button
    Then the customer is not created
    And an invalid email format validation message is displayed
    And the modal remains open

  @CUST-018
  Scenario Outline: CUST-018 - Verify various invalid email formats are rejected
    When I enter a customer name "Test User"
    And I enter an invalid email "<invalid_email>"
    And I click the "Add customer" button
    Then the customer is not created
    And an invalid email validation message is displayed

    Examples:
      | invalid_email       |
      | plainaddress        |
      | @missinglocal.com   |
      | missingdomain@      |
      | missing@.com        |
      | two@@at.com         |

  @CUST-019
  Scenario: CUST-019 - Verify both required fields empty triggers validation
    When I leave the customer name field blank
    And I leave the email field blank
    And I click the "Add customer" button
    Then the customer is not created
    And a validation message is displayed for the name field
    And a validation message is displayed for the email field
    And the modal remains open

  @CUST-020
  Scenario: CUST-020 - Verify entered values are retained after validation failure
    When I enter a valid customer name "Retained Name"
    And I enter an invalid email "bad-email-format"
    And I click the "Add customer" button
    Then a validation error is displayed for the email field
    And the customer name field still contains "Retained Name"
    And the modal remains open with previously entered data intact
