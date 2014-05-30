CucumberJsBrowserRunnerStepDefinitions.test1(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    this.Before(function(beforething, callback) {
        runner = new CucumberJsBrowserRunner();
        this.test1property = 1;
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    And(/^i have a step definition for this feature only$/, function (callback) {
        if (this.test1property === 1) {
          callback();
        } else {
          callback.fail();
        }
    });

    When(/^I load a feature '(\w+)'$/, function(feature, callback) {
        runner.loadFeatures(feature, function () {
            callback();
        }, callback.fail);
    });

    And(/^I run all features$/, function (feature, callback) {
        runner.setOutput('console');
        runner.run({
            callback : callback
        });
    });
});