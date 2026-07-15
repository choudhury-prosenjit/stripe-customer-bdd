@stripe @customers @navigation @ui
Feature: Stripe Customer Page Navigation and Structure
  As a Stripe dashboard user
  I want to navigate to and interact with the Customers page
  So that I can manage customer records effectively

  Background:
    Given I am logged in to the Stripe dashboard
    And I have the necessary permissions to manage customers

  @happy-path @CUST-001
  Scenario: CUST-001 - Open the Customers page from the left navigation
    When I locate "Customers" in the left navigation menu
    And I click on "Customers"
    Then the Customers page opens successfully
    And the page title or heading displays "Customers"

  @happy-path @CUST-002
  Scenario: CUST-002 - Verify existing customers are displayed
    Given customers already exist in the Stripe account
    When I open the Customers page
    And I review the customer table
    Then existing customers are displayed as separate rows in the table
    And each row contains at least a customer name and email

  @happy-path @CUST-003
  Scenario: CUST-003 - Verify Add Customer button is displayed
    Given I am on the Customers page
    When I check the top section of the page
    Then the "Add customer" button is visible
    And the "Add customer" button is enabled

  @happy-path @CUST-004
  Scenario: CUST-004 - Open the Add Customer modal
    Given I am on the Customers page
    When I click the "Add customer" button
    Then a modal dialog opens for creating a new customer
    And the modal contains a form for entering customer details

  @happy-path @CUST-005
  Scenario: CUST-005 - Verify customer creation fields in the modal
    Given I am on the Customers page
    And the Add Customer modal is open
    When I review the fields in the modal
    Then the following fields are available:
      | Field                |
      | Customer name        |
      | Email                |
      | Language             |
      | Billing information  |
      | Tax information      |
      | Shipping information |
      | Invoice settings     |

  @happy-path @CUST-006
  Scenario: CUST-006 - Verify default language selection in the modal
    Given I am on the Customers page
    And the Add Customer modal is open
    When I locate the language field
    Then "English (United States)" is selected by default
