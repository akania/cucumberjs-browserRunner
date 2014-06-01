CucumberJsBrowserRunnerStepDefinitions.test1(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    Given(/^test$/, function(callback) {
        callback();
    });
    When(/^test$/, function(callback) {
        callback();
    });
    Then(/^test$/, function(callback) {
        callback();
    });
});