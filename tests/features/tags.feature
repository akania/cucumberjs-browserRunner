Feature: Tags

  Scenario: execute scenarios matching a tag
    Given a web page
    When I load a feature 'test1'
    And I run all tests tagged with '@foo'
    Then only the scenario tagged with '@foo' is executed
