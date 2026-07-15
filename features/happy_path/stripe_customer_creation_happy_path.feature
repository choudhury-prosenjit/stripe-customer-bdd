@stripe @customers @happy-path
Feature: Stripe Customer Creation - Happy Path
  As a Stripe dashboard user
  I want to create customer records with various combinations of information
  So that customers are accurately stored and accessible in the system

  Background:
    Given I am logged in to the Stripe dashboard
    And I am on the Customers page
    And the Add Customer modal is open

  @CUST-007
  Scenario: CUST-007 - Create a customer using only name and email
    When I enter a valid customer name "John Doe"
    And I enter a valid email address "john.doe@example.com"
    And I leave all optional sections blank
    And I click the "Add customer" button
    Then the customer is created successfully
    And the new customer details page opens
    And the customer name "John Doe" is displayed on the details page
    And the customer email "john.doe@example.com" is displayed on the details page

  @CUST-008
  Scenario: CUST-008 - Verify newly created customer details are correct
    Given a customer has been created with name "Jane Smith" and email "jane.smith@example.com"
    When I review the customer details page
    Then the customer name "Jane Smith" is displayed correctly
    And the customer email "jane.smith@example.com" is displayed correctly

  @CUST-009
  Scenario: CUST-009 - Verify default language for the newly created customer
    Given a customer was created without changing the language setting
    When I open the new customer details page
    And I review the language information
    Then the language is displayed as "English (United States)"

  @CUST-010
  Scenario: CUST-010 - Verify optional information is not required for customer creation
    When I enter only the customer name "Alex Taylor"
    And I enter only the email "alex.taylor@example.com"
    And I do not enter billing information
    And I do not enter tax information
    And I do not enter shipping information
    And I do not enter invoice information
    And I click the "Add customer" button
    Then the customer creation succeeds without requiring optional information
    And the customer details page opens for "Alex Taylor"

  @CUST-011
  Scenario: CUST-011 - Create a customer with billing information
    When I enter a valid customer name "Alice Brown"
    And I enter a valid email "alice.brown@example.com"
    And I add the following billing information:
      | Field          | Value           |
      | Address Line 1 | 123 Main Street |
      | City           | New York        |
      | State          | NY              |
      | Postal Code    | 10001           |
      | Country        | United States   |
    And I click the "Add customer" button
    Then the customer "Alice Brown" is created successfully
    And the billing information is saved and displayed correctly on the details page

  @CUST-012
  Scenario: CUST-012 - Create a customer with tax information
    When I enter a valid customer name "Bob Wilson"
    And I enter a valid email "bob.wilson@example.com"
    And I add the following tax information:
      | Field       | Value      |
      | Tax ID Type | US EIN     |
      | Tax ID      | 12-3456789 |
    And I click the "Add customer" button
    Then the customer "Bob Wilson" is created successfully
    And the tax information is saved and displayed correctly on the details page

  @CUST-013
  Scenario: CUST-013 - Create a customer with shipping information
    When I enter a valid customer name "Carol Davis"
    And I enter a valid email "carol.davis@example.com"
    And I add the following shipping information:
      | Field          | Value          |
      | Address Line 1 | 456 Oak Avenue |
      | City           | Los Angeles    |
      | State          | CA             |
      | Postal Code    | 90001          |
      | Country        | United States  |
    And I click the "Add customer" button
    Then the customer "Carol Davis" is created successfully
    And the shipping information is saved and displayed correctly on the details page

  @CUST-014
  Scenario: CUST-014 - Create a customer with invoice settings
    When I enter a valid customer name "David Lee"
    And I enter a valid email "david.lee@example.com"
    And I configure the invoice settings with a custom due date of "30 days"
    And I click the "Add customer" button
    Then the customer "David Lee" is created successfully
    And the invoice settings are saved and displayed correctly on the details page

  @CUST-015
  Scenario: CUST-015 - Create a customer with all optional information
    When I enter a valid customer name "Emma Johnson"
    And I enter a valid email "emma.johnson@example.com"
    And I add billing information with address "789 Pine Road, Chicago, IL 60601"
    And I add tax information with Tax ID "98-7654321"
    And I add shipping information with address "321 Elm Street, Houston, TX 77001"
    And I configure invoice settings with a due date of "15 days"
    And I click the "Add customer" button
    Then the customer "Emma Johnson" is created successfully
    And the customer details page displays all entered information:
      | Section              | Status |
      | Billing information  | Saved  |
      | Tax information      | Saved  |
      | Shipping information | Saved  |
      | Invoice settings     | Saved  |
