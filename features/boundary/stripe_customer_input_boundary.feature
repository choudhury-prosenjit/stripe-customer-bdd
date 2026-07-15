@stripe @customers @boundary @data-integrity
Feature: Stripe Customer Creation - Input Boundary and Data Integrity
  As a Stripe dashboard user
  I want the system to handle boundary conditions and data edge cases consistently
  So that customer data integrity is maintained and errors are handled gracefully

  Background:
    Given I am logged in to the Stripe dashboard
    And I am on the Customers page
    And the Add Customer modal is open

  @CUST-033 @boundary
  Scenario: CUST-033 - Verify leading and trailing spaces in customer name are handled
    When I enter a customer name with leading and trailing spaces "  John Whitespace  "
    And I enter a valid email "john.whitespace@example.com"
    And I click the "Add customer" button
    Then the customer is created successfully
    And the customer name is displayed without unnecessary leading or trailing spaces

  @CUST-034 @boundary
  Scenario: CUST-034 - Verify email case handling during customer creation
    When I enter a valid customer name "Case Test User"
    And I enter an email containing uppercase letters "CASE.TEST@EXAMPLE.COM"
    And I click the "Add customer" button
    Then the customer is created successfully
    And the email is stored and displayed according to the application's normalization rules

  @CUST-035 @boundary
  Scenario: CUST-035 - Verify special characters in customer name are handled
    When I enter a customer name containing special characters "O'Brien-Smith"
    And I enter a valid email "obrien.smith@example.com"
    And I click the "Add customer" button
    Then the customer is created successfully
    And the name "O'Brien-Smith" is displayed correctly on the customer details page

  @CUST-035 @boundary
  Scenario Outline: CUST-035 - Verify various special characters in customer name
    When I enter a customer name "<special_name>"
    And I enter a valid email "special@example.com"
    And I click the "Add customer" button
    Then the customer is created successfully
    And the name "<special_name>" is displayed correctly

    Examples:
      | special_name         |
      | O'Brien              |
      | Smith-Jones          |
      | Maria Garcia         |
      | Jean-Francois Dupont |

  @CUST-036 @boundary
  Scenario: CUST-036 - Verify long customer name handling at maximum supported length
    When I enter a customer name at the maximum supported character length
    And I enter a valid email "longname@example.com"
    And I click the "Add customer" button
    Then the customer is created if the value is within the allowed limit
    And a clear validation message is displayed if the name exceeds the limit

  @CUST-036 @boundary @negative
  Scenario: CUST-036b - Verify customer name exceeding maximum length is rejected
    When I enter a customer name that exceeds the maximum supported length with 300 characters
    And I enter a valid email "toolong@example.com"
    And I click the "Add customer" button
    Then a clear validation message is displayed indicating the name is too long
    And the customer is not created

  @CUST-037 @boundary
  Scenario: CUST-037 - Verify long email address handling near maximum supported length
    When I enter a valid customer name "Long Email User"
    And I enter an email near the maximum supported length "averylongemailaddressfortestingboundaryconditions@exampledomain.com"
    And I click the "Add customer" button
    Then the email is accepted if it is within the supported length limit
    And the customer is created successfully

  @CUST-038 @data-integrity
  Scenario: CUST-038 - Verify entered optional information appears on the details page
    When I enter a valid customer name "Optional Info User"
    And I enter a valid email "optional.info@example.com"
    And I add billing information with address "100 Test Lane, Boston, MA 02101"
    And I add tax information with Tax ID "55-5555555"
    And I add shipping information with address "200 Ship Road, Miami, FL 33101"
    And I configure invoice settings
    And I click the "Add customer" button
    Then the customer is created successfully
    And the customer details page displays billing information in the billing section
    And the customer details page displays tax information in the tax section
    And the customer details page displays shipping information in the shipping section
    And the customer details page displays invoice settings in the invoice section

  @CUST-039 @data-integrity
  Scenario: CUST-039 - Verify no incorrect optional data is displayed for a minimal customer
    Given a customer was created using only name "Minimal Customer" and email "minimal@example.com"
    When I open the customer details page for "Minimal Customer"
    And I review the optional information sections
    Then the billing information section is empty or displays a default state
    And the tax information section is empty or displays a default state
    And the shipping information section is empty or displays a default state
    And no incorrect or fabricated optional data is displayed

  @CUST-040 @negative @error-handling
  Scenario: CUST-040 - Verify customer creation failure handling when service is unavailable
    Given the customer creation service is unavailable or returns an error
    When I enter valid customer information with name "Error Test User" and email "error.test@example.com"
    And I click the "Add customer" button
    Then a clear and user-friendly error message is displayed
    And the modal remains open and usable
    And no incomplete customer record is created
    And the user can retry the submission
