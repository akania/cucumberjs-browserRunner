Feature:Outline scenario feature

    Scenario Outline: test run of outline scenario
        Given There is initial <value>
        When I subsctract <subsctractValue>
        Then I should have <resultValue>

    Examples:
    | value | subsctractValue | resultValue |
    |  12   |  5              |  7          |
    |  20   |  5              |  15         |
