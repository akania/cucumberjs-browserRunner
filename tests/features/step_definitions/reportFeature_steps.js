CucumberJsBrowserRunner.StepDefinitions.reportFeature(function () {

    var And = Given = When = Then = this.defineStep,
        featureName = '',
        featureCode = {},
        stepRunner

    this.Before(function(beforething, callback) {
        this.featureRunner = new CucumberJsBrowserRunner();
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    When(/^I load a feature '(\w+)'$/, function(feature, callback) {
        this.featureRunner.loadFeatures(feature, function () {
            featureCode[feature] = feature;
            callback();
        }, callback.fail);
    });

    And(/^I run feature '(\w+)'$/, function (feature, callback) {
        this.featureRunner.setOutput('console');
        this.featureRunner.run({
            featureName : feature,
            callback :  callback
        });
    });

    Then(/^i can check report summary with '(\w+)' status$/, function(status, callback) {
        if (this.featureRunner.getReport().getSummary() === status) {
            callback();
        } else {
            callback.fail();
        }
    });

    Then(/^i can check that feature with name '(.*)' failed$/, function(featureName, callback) {
        if (this.featureRunner.getReport().getFailed()[0].name === featureName) {
            callback();
        } else {
            callback.fail();
        }
    });

});