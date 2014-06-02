Feature: Run tests based on features
  In order to run tests for a feature
  As a developer
  I want to be able to use runner to load a feature(s) file(s) and step definition(s) and run the tests

  Scenario: load two feature files and step file for feature, run all features
    Given a web page
    When I load a feature 'test1' and 'test2'
    Then I can run all features

  Scenario: load two feature files and step file for feature, run only first feature
    Given a web page
    When I load a feature 'test1' and 'test2'
    Then I run feature 'test2'
    And I Can verify that only second has passed