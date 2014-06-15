CucumberJsBrowserRunner.StepDefinitions.runFeatures(function () {

    var And = Given = When = Then = this.defineStep,
        featureName = '',
        featuresCode = {},
        runner,
        world = this;

    this.Before(function(beforething, callback) {
        this.runner = new CucumberJsBrowserRunner();
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    When(/^I load following features '(.*)'$/, function(features, callback) {
        var featuresArray = features.split(',');
        var testRunner = this.runner;
        testRunner.loadFeatures(featuresArray, function (runner) {
            featuresCode = testRunner.getAllFeatures();
            callback();
        });
    });

    And(/^I run feature '(\w+)'$/, function (feature, callback) {
        var testRunner = this.runner;
        testRunner.setOutput('console');
        testRunner.run({
            features : feature,
            callback : callback
        });
    });

    And(/^I Can verify that only second has passed$/, function (callback) {
        var testRunner = this.runner;
        if (!testRunner.getReport().getFeature('Test feature 1') &&
            testRunner.getReport().getFeature('Test feature 2').getSummary() === "passed") {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^I can run all features$/, function (callback) {
        this.runner.setOutput('console');
        this.runner.run({callback : callback});
    });


});