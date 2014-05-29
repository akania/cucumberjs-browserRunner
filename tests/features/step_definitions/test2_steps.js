CucumberJsBrowserRunnerStepDefinitions.test2(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    this.Before(function(beforething, callback) {
        this.test1property = 2;
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    And(/^i have a step definition for this feature only$/, function (callback) {
        if (this.test1property === 2) {
          callback();
        } else {
          callback.fail();
        }
    });

    When(/^i do nothing$/, function(feature, callback) {
        runner.loadFeatures(feature, function () {
            callback();
        }, callback.fail);
    });

    Then(/^nothing will happen$/, function (feature, callback) {
        callback();
    });
});