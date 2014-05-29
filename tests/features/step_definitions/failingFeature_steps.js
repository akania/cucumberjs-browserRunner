CucumberJsBrowserRunnerStepDefinitions.failingFeature(function () {

  var And = Given = When = Then = this.defineStep;


  Given(/^test1$/, function(callback) {
      callback();
  });

  When(/^test2$/, function(callback) {
      callback();
  });

  Then(/^test3$/, function(callback) {
      callback.fail();
  });
});