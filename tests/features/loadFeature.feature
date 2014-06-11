Feature: Loading feature files
  In order to run tests for a feature
  As a developer
  I want to be able to use runner to load a feature(s) file and run the test(s)

  @loadFeature
  Scenario: load one feature file and step definition file for that feature
    Given a web page
    When I load a feature 'test1'
    Then i can verify that definition for feature 'test1' contains 'Test feature 1'
    And step definition file is loaded for feature 'test1'
  
  @loadFeature
  Scenario: load two feature files and step file for feature
    Given a web page
    When I load a feature 'test1' and 'test2'
    Then i can verify that definition for feature 'test1' contains 'Test feature 1'
    And i can verify that definition for feature 'test2' contains 'Test feature 2'

  Scenario: try to load a feature which is not defined
    Given a web page
    When I load a feature 'featureThatDoesntExist'
    Then I get the information that 'featureThatDoesntExist' feature was not loaded

  Scenario: try to load a feature with no step definition
    Given a web page
    When I load a feature 'featureWithoutStep'
    Then I get the information that for 'featureWithoutStep' feature step definition was not loaded




