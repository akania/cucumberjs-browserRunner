Feature: Demo feature
    In order follow ATDD
    As a developer i would like to be able to write specs using Gherkin syntax and execute them using browser runner
    So i'm able to test my application in various browsers and environments

    Background: Every scenario may have a common background
        Steps defined by the background are executed before every scenario ( but after every Before hook )

        Given This page is loaded
        And We have defined state of our application

    @basic @world
    Scenario: Simple synchronous scenario
        Simple synchronous scenario based on 3 steps

        Given I have a simple scenario
        When I perform some synchronous action
        Then I can verify the results
    
    @basic @async @world
    Scenario: Simple asynchronous scenario
        Simple asynchronous scenario, When step is asynchronous

        Given I have a simple scenario
        When I perform some action that is asynchronous
        Then I can verify the results

    @basic @world
    Scenario: Simple synchronous scenario using world instance
        Using world instance to work with application

        Given I have a simple scenario
        When I use world instance to perform some synchronous action
        Then I can verify the results
    
    @basic @world @async
    Scenario: Simple asynchronous scenario using world instance
        Using world instance to work with application

        Given I have a simple scenario
        And I use world instance to perform some asynchronous action
        Then I can verify the results

    @basic @world @async @datatable
    Scenario: Simple scenario with data table
              Data tables can be used to pass big sets of data into step definition

        Given I have a simple scenario
        When I specify bigger set of data as a table
            | first  | second | last |
            | 1      | b      | true |
            | 2      | c      | false|
            | 3      | d      |      |
        Then I can read it in the step definition

    @outline1
    Scenario Outline: Scenario outline - run this scenario with different examples
                      To run one scenario with different set of values use scenario outlines

        Given There is initial <value>
        When I subsctract <subsctractValue>
        Then I should have <resultValue>
    
    Examples:
    | value | subsctractValue | resultValue |
    |  12   |  5              |  7          |
    |  5   |  5              |  0          |
    |  15   |  5              |  10          |

    @outline2
    Scenario Outline: Scenario outline - another outline scenario with different tag
                      To run one scenario with different set of values use scenario outlines

        Given There is initial <value>
        When I subsctract <subsctractValue>
        Then I should have <resultValue>
    
    Examples:
    | value | subsctractValue | resultValue |
    |  12   |  5              |  7          |
    |  5   |  5              |  0          |

    @errorHandling
    Scenario: Simple scenario with error
        Simple scenario, When step triggers error

        Given I have a simple scenario
        When I perform some action that throws an error
        Then Tests continues

    @timeout
    Scenario: Simple scenario with timeout
        Simple scenario, When step takes longer than value of a timeout set by 
        var globalRunner = new CucumberJsBrowserRunner({
              timeout : 500
        });

        Given I have a simple scenario
        When My step will trigger timeout
        Then I will see it in the runner