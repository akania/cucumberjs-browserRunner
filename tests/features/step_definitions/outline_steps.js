CucumberJsBrowserRunner.StepDefinitions.outline(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    Given(/^There is initial (\d+)$/, function(value, callback) {
        this.value = value;
        callback();
    });
    When(/^I subsctract (\d+)$/, function(substractValue, callback) {
        this.result = this.value - substractValue;
        callback();
    });
    Then(/^I should have (\d+)$/, function(result, callback) {
        if (parseInt(result) === this.result) {
            callback();
        } else {
            callback.fail();    
        }
    });
});