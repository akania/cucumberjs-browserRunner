CucumberJsBrowserRunner.StepDefinitions.loadFeature(function () {

    var And = Given = When = Then = this.defineStep,
        featureName = '',
        featuresCode = {},
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


    When(/^I load following features '(.*)'$/, function(features, callback) {
        var featuresArray = features.split(',');
        var testRunner = this.runner;
        testRunner.loadFeatures(featuresArray, function (runner) {
            featuresCode = testRunner.getAllFeatures();
            callback();
        });
    });

    When(/^I load following feature '(.*)' with '(.*)' background defined$/, function(featureName, backgroundName, callback) {
        var testRunner = this.runner;
        testRunner.loadFeatures({
            name : featureName, 
            backgroundSteps : [backgroundName]
        }, function (runner) {
            featuresCode = testRunner.getAllFeatures();
            callback();
        });
    });

    Then(/^I can verify that definition for feature '(\w+)' contains '(.*)'$/, function(featureName, featureCodeFragment, callback) {
        if (featuresCode[featureName].source.indexOf(featureCodeFragment) > -1 ) {
            callback();
        } else {
            callback.fail();
        }
    });

    And(/^Step definition file is loaded for feature '(\w+)'$/, function (feature, callback) {
        if (this.runner.getFeatureStepDefinitions(feature)) {
            callback();
        } else {
            callback.fail();
        }
    });

    And(/^Background step definition file is loaded for background '(\w+)'$/, function (feature, callback) {
        if (this.runner.getFeatureBackgroundStepDefinitions(feature)) {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^I get the information that '(\w+)' feature was not loaded$/, function (feature, callback) {
        if (this.runner.getReport().getFeature(feature).status === 'failed' &&
            this.runner.getReport().getFeature(feature).message === 'Unable to load a feature file') {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^I get the information that for '(\w+)' feature step definition was not loaded$/, function (feature, callback) {
        if (this.runner.getReport().getFeature(feature).status === 'failed' &&
            this.runner.getReport().getFeature(feature).message === 'Unable to load a step definition for feature ' + feature) {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^I get the information that for '(\w+)' feature background step definition was not loaded$/, function (feature, callback) {
        if (this.runner.getReport().getFeature(feature).status === 'failed' &&
            this.runner.getReport().getFeature(feature).message === 'Unable to load a background step definition for feature ' + feature) {
            callback();
        } else {
            callback.fail();
        }
    });

});