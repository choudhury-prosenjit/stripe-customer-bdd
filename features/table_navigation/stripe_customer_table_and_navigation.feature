@stripe @customers @ui @navigation
Feature: Stripe Customer Table Display and Post-Creation Navigation
  As a Stripe dashboard user
  I want to view and navigate customer records in the table
  So that I can locate and access correct customer information efficiently

  Background:
    Given I am logged in to the Stripe dashboard

  @happy-path @CUST-021
  Scenario: CUST-021 - Verify customer appears in the table after creation
    Given a new customer "Frank Miller" with email "frank.miller@example.com" has been created
    When I click "Customers" from the left navigation menu
    And I review the customer table
    Then the customer "Frank Miller" appears in the customer table
    And existing customers are also visible in the table

  @happy-path @CUST-022
  Scenario: CUST-022 - Verify newly created customer information in the table
    Given a new customer "Grace Hopper" with email "grace.hopper@example.com" has been created
    When I return to the Customers page
    And I locate the row for "Grace Hopper"
    Then the table row displays the name "Grace Hopper"
    And the table row displays the email "grace.hopper@example.com"

  @happy-path @CUST-023
  Scenario: CUST-023 - Open an existing customer details page from the table
    Given at least one customer exists in the account
    And I am on the Customers page
    When I click on an existing customer row
    Then the selected customer's details page opens
    And the details page displays that customer's information

  @happy-path @CUST-024
  Scenario: CUST-024 - Verify correct customer details are opened
    Given at least two customers exist in the customer table
    And I am on the Customers page
    When I note the name "Henry Adams" and email "henry.adams@example.com" of a specific customer
    And I click on that customer's row
    Then the details page displays the name "Henry Adams"
    And the details page displays the email "henry.adams@example.com"
    And the details page does not display another customer's information

  @happy-path @CUST-025
  Scenario: CUST-025 - Open newly created customer from the customer table
    Given a new customer "Iris Chen" with email "iris.chen@example.com" has been created
    When I return to the Customers page
    And I click on the row for "Iris Chen"
    Then the details page for "Iris Chen" opens
    And the email "iris.chen@example.com" is displayed on the details page

  @happy-path @CUST-026
  Scenario: CUST-026 - Verify customer table remains accessible after viewing details
    Given I am on a customer details page
    When I click "Customers" from the left navigation menu
    Then the customer table page opens
    And all customers are displayed in the table

  @happy-path @CUST-027
  Scenario: CUST-027 - Verify multiple customers can be created sequentially
    Given I am on the Customers page
    And the Add Customer modal is open
    When I create a customer with name "Jack Ryan" and email "jack.ryan@example.com"
    And I return to the Customers page
    And I open the Add Customer modal again
    And I create a second customer with name "Karen White" and email "karen.white@example.com"
    And I return to the Customers page
    Then both "Jack Ryan" and "Karen White" appear as separate rows in the customer table
