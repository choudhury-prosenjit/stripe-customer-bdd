@stripe @customers @edge-case
Feature: Stripe Customer Creation - Edge Cases and Modal Behavior
  As a Stripe dashboard user
  I want the system to handle edge cases gracefully
  So that data integrity and a reliable user experience are maintained

  Background:
    Given I am logged in to the Stripe dashboard
    And I am on the Customers page

  @CUST-028
  Scenario: CUST-028 - Verify duplicate email handling
    Given a customer already exists with the email "existing@example.com"
    And the Add Customer modal is open
    When I enter a different customer name "New Name"
    And I enter the already-used email "existing@example.com"
    And I click the "Add customer" button
    Then the application handles the duplicate email according to the business rule
    And either the customer is created with a warning
    Or a clear validation message is displayed indicating the email is already in use

  @CUST-029
  Scenario: CUST-029 - Verify cancel or close action on Add Customer modal
    Given the Add Customer modal is open
    When I enter the customer name "Cancelled Customer"
    And I enter the email "cancelled@example.com"
    And I click the modal close or cancel control
    Then the modal closes
    And no customer is created

  @CUST-030
  Scenario: CUST-030 - Verify customer is not added after cancelling creation
    Given the Add Customer modal was opened and closed without submission
    When I remain on or return to the Customers page
    And I search the customer table for "Cancelled Customer"
    Then no customer record for "Cancelled Customer" is found in the table

  @CUST-031 @concurrency
  Scenario: CUST-031 - Verify double-clicking Add Customer does not create duplicates
    Given the Add Customer modal is open
    And I have entered a valid name "Single Customer"
    And I have entered a valid email "single.customer@example.com"
    When I rapidly click the "Add customer" submission button more than once
    Then only one customer record is created for "Single Customer"
    And no duplicate entries appear in the customer table

  @CUST-032 @ui @concurrency
  Scenario: CUST-032 - Verify submission button behavior during customer creation
    Given the Add Customer modal is open
    And I have entered a valid customer name "Button Test User"
    And I have entered a valid email "buttontest@example.com"
    When I click the "Add customer" button
    And I observe the button while the request is processing
    Then the button shows a processing or loading state
    And duplicate submissions are prevented
