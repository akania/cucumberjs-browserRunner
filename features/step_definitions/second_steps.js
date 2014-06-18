CucumberJsBrowserRunner.StepDefinitions.second(function () {
  // Provide a custom World constructor. It's optional, a default one is supplied.
  this.World = function(callback) {
    var self = this;
    CucumberJsBrowserRunner.loadWorld('demoWorld', function (WorldConstructor) {
        self.world = new WorldConstructor();
        callback(self.world);
    });
  };


  var Given = When = Then = And = this.defineStep;

  this.Before(function (callback) {
      console.log('Before every Scenario in second feature');
      callback();
  });

  Given(/^I have a simple scenario$/, function (callback) {
      callback();
  });

  When(/^I perform some synchronous action$/, function (callback) {
      this.property++;
      callback();
  });

  Then(/^I can verify the results$/, function (callback) {
      if (this.property === 2) {
          callback();
      } else {
          callback.fail()
      }
  });

});
