CucumberJsBrowserRunner.BackgroundStepDefinitions.secondBackground(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    And(/^Second background step succeded$/, function(callback) {
        callback();
    });
});