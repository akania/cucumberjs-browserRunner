Feature: Custom listeners for cucumber js browser runner
  In order to get feedback from the test run
  As a developer
  I want to be able to use different listeners for cucumber js

  Scenario: use HTML listener to generate report in HTML
    Given A web page
    When I run a test suite
    Then I can get visual feedback from the test by checking test output on the page

  