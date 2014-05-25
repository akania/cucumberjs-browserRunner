Feature: Loading feature files
  In order to run tests against feature
  As a developer
  I want to be able to load this feature file

  Scenario: load one feature file and step file for feature
    Given a web page
    When I load a feature 'loadFeature'
    Then i can verify that definition for feature 'loadFeature' contains 'Loading feature files'
    And step definition file is loaded for feature 'loadFeature'

  Scenario: load two feature files and step file for feature
    Given a web page
    When I load a feature 'test1' and 'test2'
    Then i can verify that definition for feature 'test1' contains 'test1'
    And i can verify that definition for feature 'test2' contains 'test2'

  Scenario: load one feature file, step file for feature and world instance for this feature
    Given a web page
    When I load a feature 'testWorld'
    And I run feature 'testWorld'
    Then i can access world instance for this feature
  