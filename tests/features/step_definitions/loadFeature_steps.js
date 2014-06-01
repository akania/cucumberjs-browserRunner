CucumberJsBrowserRunnerStepDefinitions.loadFeature(function () {

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

    When(/^test '(.*)'$/, function (value, callback) {
        callback();
    });
    When(/^i get '(.*)'$/, function (value, callback) {
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

    Then(/^i can verify that definition for feature '(\w+)' contains '(.*)'$/, function(featureName, featureCodeFragment, callback) {
        if (featureCode[featureName].indexOf(featureCodeFragment) > -1 ) {
            callback.fail();
        } else {
            callback();
        }
    });
    

    Then(/^I fail the test$/, function(callback) {
        callback.fail();
    });



    Then(/^i can access world instance for this feature$/, function (callback) {
        callback();
    });

    Then(/^i can see in report that feature test '(\w+)'$/, function (status, callback) {
        if (status === this.runner.getReport().features[0].status) {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^i can check results for all tests$/, function (callback) {
        if(this.runner.getReport()) {
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

    And(/^step definition file is loaded for feature '(\w+)'$/, function (feature, callback) {
        if (CucumberJsBrowserRunnerStepDefinitions[feature]) {
            callback();
        } else {
            callback.fail();
        }
    });

    And(/^I run feature '(\w+)'$/, function (feature, callback) {
        this.runner.setOutput('console');
        this.runner.run({
            featureName : feature,
            customListeners : {
              StepResult : function (stepResult) {
                  if (stepResult.getStep().getName() === 'c' && stepResult.isSuccessful()) {
                      callback();
                  }
              }
            },
            callback : callback
        });
        if (feature === 'testWorld') {
            callback();
        }
    });

    And(/^I run all features$/, function (callback) {
        this.runner.setOutput('console');
        this.runner.run({callback : callback});
    });

    When(/^I try to load a features '(.*)'$/, function (features, callback) {
        
        this.runner.loadFeatures(features.split(','), function (features) {
            featureCode[features] = features;
            callback();
        });

    });

    Then(/^An error callback is called while loading feature$/, function (callback) {
        if (this.failedToLoadFeature) {
              callback();
          } else {
              callback.fail();
          }
    });
    And(/^Test summary is '(\w+)'$/, function (status, callback) {
        if (this.runner.getReport().getSummary() === status) {
            callback();
        } else {
            callback.fail();
        }
    });

});