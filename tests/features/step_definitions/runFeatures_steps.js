CucumberJsBrowserRunnerStepDefinitions.runFeatures(function () {

    var And = Given = When = Then = this.defineStep,
        featureName = '',
        featureCode = {},
        runner,
        world = this;

    this.Before(function(beforething, callback) {
        this.runner = new CucumberJsBrowserRunner();
        this.failedToLoadFeature = '';
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    When(/^I load a feature '(\w+)'$/, function(feature, callback) {
        var testRunner = this.runner;
        this.aboutToLoad = feature;
        testRunner.loadFeatures(feature, function (runner) {
            featureCode[feature] = feature;
            callback();
        });
    });

    
    When(/^I load a feature '(\w+)' and '(\w+)'$/, function(feature1, feature2, callback) {
        var testRunner = this.runner;
        testRunner.loadFeatures([feature1, feature2], function (runner) {
            featureCode[feature1] = testRunner.getFeature(feature1);
            featureCode[feature2] = testRunner.getFeature(feature1);
            callback();
        });
    });

    Then(/^i can access world instance for this feature$/, function (callback) {
        callback();
    });

    And(/^step definition file is loaded for feature '(\w+)'$/, function (feature, callback) {
        if (CucumberJsBrowserRunnerStepDefinitions[feature]) {
            callback();
        } else {
            callback.fail();
        }
    });

    And(/^I run feature '(\w+)'$/, function (feature, callback) {
        var runner = this.runner;
        runner.setOutput('console');
        runner.run({
            features : feature,
            callback : function () {
                window.myrunner = runner;
                callback();
            }
        });
    });

    And(/^I Can verify that only second has passed$/, function (callback) {
        if (!myrunner.getReport().getFeature('Test feature 1') &&
            myrunner.getReport().getFeature('Test feature 2').getSummary() === "passed") {
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