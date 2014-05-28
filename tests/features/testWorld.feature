Feature: Loading feature files 1
  In order to run tests against feature 1
  As a developer 1
  I want to be able to load this feature file 1

  Scenario: load two feature files and step file for feature
    Given a web page
    When I load a feature 'test1' and 'test2'
    Then i can verify that definition for feature 'test1' contains 'test1'
    And i can verify that definition for feature 'test2' contains 'test2'