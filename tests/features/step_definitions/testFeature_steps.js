CucumberJsBrowserRunnerStepDefinitions.testFeature(function () {

  var And = Given = When = Then = this.defineStep;


  Given(/^a/, function(callback) {
      callback();
  });

  When(/^b/, function(callback) {
      callback();
  });

  Then(/^c/, function(callback) {
      callback();
  });
});