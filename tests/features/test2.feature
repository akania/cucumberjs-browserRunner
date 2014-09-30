Feature:Test feature 2
        Here some text
          
  @test2
  Scenario: run test feature 1
            some description?
    Given test1
    When test
    Then test

  @test3 @test2
  Scenario: run test feature 2
            multiple lines description
            with some random things
    Given test2
    When test
    Then test
