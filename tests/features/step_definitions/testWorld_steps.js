CucumberJsBrowserRunnerStepDefinitions.testWorld(function () {

  var And = Given = When = Then = this.defineStep,
      World = this.World;

  this.World = function(callback) {
      CucumberJsBrowserRunner.loadWorld('testWorld', function (world) {
          callback(world());
      });
  };

  this.Before(function(callback) {
      callback();
  });

  Given(/^a$/, function(callback) {
      callback();
  });
  Given(/^b$/, function(callback) {
      callback();
  });
  Given(/^c$/, function(callback) {
      callback();
  });
});