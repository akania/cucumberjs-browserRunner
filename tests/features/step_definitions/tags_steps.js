CucumberJsBrowserRunner.StepDefinitions.tags(function () {

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

    And(/^I run all tests tagged with '(@\w+)'$/, function (tag, callback) {
        var testRunner = this.runner;
        testRunner.run({
            tags : [tag],
            callback : callback
        });
    });

    Then(/^only the scenario tagged with '(@\w+)' is executed$/, function (tag ,callback) {
        var testRunner = this.runner;
        if (testRunner.getReport().getFeature('Test feature 1').elements.length === 1 &&
            testRunner.getReport().getFeature('Test feature 1').elements[0].name === 'run test feature 1 tagged @foo') {
            callback();    
        } else {
            callback.fail();
        }
        
    });
    

});