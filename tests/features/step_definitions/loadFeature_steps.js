CucumberJsBrowserRunnerStepDefinitions.loadFeature(function () {
  
  var And = Given = When = Then = this.defineStep,
    featureName = '',
    featureCode = {},
    runner;

  this.Before(function(callback) {
    runner = new CucumberJsBrowserRunner();
    callback();
  });

  Given(/^a web page$/, function(callback) {
      callback();
  });

  When(/^I load a feature '(\w+)'$/, function(feature, callback) {
      runner.loadFeature(feature, function (runner) {
        featureCode[feature] = feature;
        callback();
      }, callback.fail);
  });

  When(/^I load a feature '(\w+)' and '(\w+)'$/, function(feature1, feature2, callback) {
      runner.loadFeature([feature1, feature2], function (runner) {
        featureCode[feature1] = runner.getFeature(feature1);
        featureCode[feature2] = runner.getFeature(feature1);
        callback();
      }, callback.fail);
  });


  Then(/^i can verify that definition for feature '(\w+)' contains '(.*)'$/, function(featureName, featureCodeFragment, callback) {
      if (featureCode[featureName].indexOf(featureCodeFragment) > -1 ) {
          callback.fail();
      } else {
          callback();
      }     
  });

  Then(/^i can access world instance for this feature$/, function(callback) {
      /*try {
          var world = runner.getWorldInstance();
          if (world.testProperty === 123) {
              callback();
          } else {
              callback.fail();
          }
      } catch(e) {
          callback.fail();
      }*/
  });


  And(/^step definition file is loaded for feature '(\w+)'$/, function (feature, callback) {
      if (CucumberJsBrowserRunnerStepDefinitions[feature]) {
          callback();
      } else {
          callback.fail();
      } 
  });

  And(/^I run feature '(\w+)'$/, function (feature, callback) {
      runner.setOutput('console');
      runner.run(feature);
  });
});