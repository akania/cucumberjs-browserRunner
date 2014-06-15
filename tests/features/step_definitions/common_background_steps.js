CucumberJsBrowserRunner.BackgroundStepDefinitions.common(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    Given(/^a background step/, function(callback) {
        callback();
    });
    And(/^a another background step/, function(callback) {
        callback();
    });
});