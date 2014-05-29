CucumberJsBrowserRunnerStepDefinitions.reportFeature(function () {

    var And = Given = When = Then = this.defineStep,
        featureName = '',
        featureCode = {},
        featureRunner,
        stepRunner

    this.Before(function(beforething, callback) {
        featureRunner = new CucumberJsBrowserRunner();
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    When(/^I load a feature '(\w+)'$/, function(feature, callback) {
        featureRunner.loadFeatures(feature, function () {
            featureCode[feature] = feature;
            callback();
        }, callback.fail);
    });

    And(/^I run feature '(\w+)'$/, function (feature, callback) {
        featureRunner.setOutput('console');
        featureRunner.run(feature);
        callback();
    });

    Then(/^i can check report summary with '(\w+)' status$/, function(status, callback) {
        console.log('status should be ', status, featureRunner.getReport().getSummary())
        if (featureRunner.getReport().getSummary() === status) {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^i can check that feature with name '(\w+)' failed$/, function(featureName, callback) {
        if (featureRunner.getReport().getFailed()[0].name === featureName) {
            callback();
        } else {
            callback.fail();
        }
    });
     
});