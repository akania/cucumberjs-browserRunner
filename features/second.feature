Feature: Second feature
    Second feature, two background steps combined

    Background: Two background step definitions combined

        Given This page is loaded
        And Second background step succeded

    @demoFeatureBackground
    Scenario: Simple synchronous scenario
        Simple synchronous scenario based on 3 steps

        Given I have a simple scenario
        When I perform some synchronous action
        Then I can verify the results
    