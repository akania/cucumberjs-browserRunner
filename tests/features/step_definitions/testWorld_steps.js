CucumberJsBrowserRunnerStepDefinitions.testWorld(function () {
  
  var And = Given = When = Then = this.defineStep,
      World = this.World;

  this.World = function(callback) {
      alert(1);
      CucumberJsBrowserRunner.loadWorld('testWorld', function (world) {
          console.log('my world', world);
          callback(world);
      });
  };

  this.Before(function(callback) {
      console.log(this.World)
      callback();
  });
});