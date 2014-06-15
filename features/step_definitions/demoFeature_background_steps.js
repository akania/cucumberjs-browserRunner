CucumberJsBrowserRunner.BackgroundStepDefinitions.demoFeature(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    Given(/^This page is loaded$/, function(callback) {
        callback();
    });
    And(/^We have defined state of our application$/, function(callback) {
        callback();
    });
});