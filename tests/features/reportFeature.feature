Feature: Generating report
  In order to get feedback from the runner
  As a developer
  I want to be able to get report after test run finishes

  Scenario: run test on a feature and get the report
    Given a web page
    When I load a feature 'testFeature'
    And I run feature 'testFeature'
    Then i can see in report that feature test 'passed'
