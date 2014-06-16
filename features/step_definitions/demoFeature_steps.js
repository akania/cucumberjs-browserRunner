CucumberJsBrowserRunner.StepDefinitions.demoFeature(function () {
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
      console.log('Before every Scenario');
      callback();
  });

  this.After(function (callback) {
      console.log('After every Scenario');
      callback();
  });

  Given(/^I have a simple scenario$/, function (callback) {
      callback();
  });

  When(/^I perform some synchronous action$/, function (callback) {
      this.property++;
      callback();
  });

  When(/^I perform some action that is asynchronous/, function (callback) {
      var world = this;
      setTimeout(function () {
        world.property++;
        callback();
      }, 500);
  });

  Then(/^I can verify the results$/, function (callback) {
      if (this.property === 2) {
          callback();
      } else {
          callback.fail()
      }
  });

  /* World */
  When(/^I use world instance to perform some synchronous action$/, function (callback) {
      this.incrementProperty();
      callback();
  });
  And(/^I use world instance to perform some asynchronous action$/, function (callback) {
      this.asyncIncrementProperty(callback);
  });


  /* Data table */
  When(/^I specify bigger set of data as a table$/, function (data, callback) {
      this.dataTable = data;
      callback();
  });
  When(/^I can read it in the step definition$/, function (callback) {
      this.dataTable.getRows().forEach(function(row){
          console.log(row.raw())
      });

      if (this.dataTable.raw()[0][0] === "first" &&
          this.dataTable.raw()[3][2] === "") {
          callback();
      } else {
          callback.fail();
      }
  });

  /* Scenario outline */
  Given(/^There is initial (\d+)$/, function(value, callback) {
      this.value = value;
      callback();
  });
  When(/^I subsctract (\d+)$/, function(substractValue, callback) {
      this.result = this.value - substractValue;
      callback();
  });
  Then(/^I should have (\d+)$/, function(result, callback) {
      if (parseInt(result) === this.result) {
          callback();
      } else {
          callback.fail();    
      }
  });

});
