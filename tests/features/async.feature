Feature: Async
  
  Scenario: test first async operation
    Given test
    When I call and wait with value '1'
    Then I get value '1'

  Scenario: test second async operation
    Given test
    When I call and wait with value '2'
    Then I get value '2'


