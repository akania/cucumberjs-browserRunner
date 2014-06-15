Feature: Loading feature files
  In order to run tests for a feature
  As a developer
  I want to be able to use runner to load a feature(s) file and run the test(s)

  @loadFeature
  Scenario: load one feature file and step definition file for that feature
    Given a web page
    When I load following features 'test1'
    Then I can verify that definition for feature 'test1' contains 'Test feature 1'
    And Step definition file is loaded for feature 'test1'
  
  @loadFeature
  Scenario: load two feature files and step file for feature
    Given a web page
    When I load following features 'test1,test2'
    Then I can verify that definition for feature 'test1' contains 'Test feature 1'
    And I can verify that definition for feature 'test2' contains 'Test feature 2'
  
  @backgroundDefiniton
  Scenario: load a feature with background steps
    Given a web page
    When I load following feature 'backgroundSteps' with 'common' background defined
    Then I can verify that definition for feature 'backgroundSteps' contains 'Test feature with background steps defined'
    And Background step definition file is loaded for background 'common'

  Scenario: try to load a feature which is not defined
    Given a web page
    When I load following features 'featureThatDoesntExist'
    Then I get the information that 'featureThatDoesntExist' feature was not loaded

  Scenario: try to load a feature with no step definition
    Given a web page
    When I load following features 'featureWithoutStep'
    Then I get the information that for 'featureWithoutStep' feature step definition was not loaded
  
  @backgroundDefiniton
  Scenario: try to load a feature with background steps
    Given a web page
    When I load following feature 'backgroundSteps' with 'nonExistingBackground' background defined
    Then I get the information that for 'backgroundSteps' feature background step definition was not loaded
  



