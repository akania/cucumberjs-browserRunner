CucumberBrowserRunnerStepDefinitions.test = function () {
  // Provide a custom World constructor. It's optional, a default one is supplied.
  this.World = function(callback) {
    callback();
  };

  // Define your World!

  this.World.prototype.variable = 0;

  this.World.prototype.setTo = function(number) {
      this.variable = parseInt(number);
  };

  this.World.prototype.incrementBy = function(number) {
      this.variable += parseInt(number);
  };

  var Given = When = Then = this.defineStep;

  Given(/^a variable set to (\d+)$/, function(number, callback) {
      this.setTo(number);
      callback();
  });

  When(/^I increment the variable by (\d+)$/, function(number, callback) {
      this.incrementBy(number);
      callback();
  });

  Then(/^the variable should contain (\d+)$/, function(number, callback) {
    if (this.variable != parseInt(number))
      callback.fail(new Error('Variable should contain ' + number +
        ' but it contains ' + this.variable + '.'));
    else
      callback();
  });
}