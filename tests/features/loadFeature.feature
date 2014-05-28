Feature: Loading feature files
  In order to run tests for a feature
  As a developer
  I want to be able to use runner to load a feature(s) file and run the test(s)

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

  Scenario: load two feature files and step file for feature, run all featuress
    Given a web page
    When I load a feature 'test1' and 'test2'
    And I run all features
    Then i can see results for all tests

  Scenario: load one feature file, step file for feature and world instance for this feature
    Given a web page
    When I load a feature 'testWorld'
    And I run feature 'testWorld'
    Then i can access world instance for this feature
