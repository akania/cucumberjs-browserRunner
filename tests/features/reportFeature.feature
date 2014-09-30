Feature: Generating report
  In order to get feedback from the runner
  As a developer
  I want to be able to get report after test run finishes

  Scenario: run sucessfull test on a feature and get the report summary with 'passed' status
    Given a web page
    When I load a feature 'testFeature'
    And I run feature 'testFeature'
    Then i can check report summary with 'passed' status

  Scenario: run failing test on a feature and get the report summary with 'failed' status
    Given a web page
    When I load a feature 'failingFeature'
    And I run feature 'failingFeature'
    Then i can check report summary with 'failed' status

  Scenario: run failing test on a feature and get the report about failing feature
    Given a web page
    When I load a feature 'failingFeature'
    And I run feature 'failingFeature'
    Then i can check that feature with name 'Test failing feature' failed

  Scenario: run feature and get different report summaries at different stages of the test
    Given a web page
    When I load a feature 'slowFeature'
    Then i can check report summary with 'pending' status
    And I run feature 'slowFeature'
    Then i can check report summary with 'passed' status