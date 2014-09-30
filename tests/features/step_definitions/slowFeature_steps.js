CucumberJsBrowserRunner.StepDefinitions.slowFeature(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    Given(/^test$/, function(callback) {
        setTimeout(callback, 500);
    });
    When(/^test$/, function(callback) {
        setTimeout(callback, 500);
    });
    Then(/^test$/, function(callback) {
        setTimeout(callback, 500);
    });
});