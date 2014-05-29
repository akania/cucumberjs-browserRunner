CucumberJsBrowserRunnerStepDefinitions.reportFeature(function () {

    var And = Given = When = Then = this.defineStep,
        featureName = '',
        featureCode = {},
        runner;

    this.Before(function(beforething, callback) {
        runner = new CucumberJsBrowserRunner();
        callback();
    });

    Given(/^a web page$/, function(callback) {
        callback();
    });

    When(/^I load a feature '(\w+)'$/, function(feature, callback) {
        runner.loadFeatures(feature, function (runner) {
            featureCode[feature] = feature;
            callback();
        }, callback.fail);
    });

    And(/^I run feature '(\w+)'$/, function (feature, callback) {
        runner.setOutput('console');
        runner.run(feature, {
              StepResult : function (stepResult) {
                  console.log('step results')
                  if (stepResult.getStep().getName() === 'c' && stepResult.isSuccessful()) {
                      callback();
                  }
              }
          });
    });

    Then(/^i can see in report that feature test '(\w+)'$/, function(status, callback) {
        if (status === runner.getReport().features[0].status) {
            callback();
        } else {
            callback.fail();
        }
    });
});