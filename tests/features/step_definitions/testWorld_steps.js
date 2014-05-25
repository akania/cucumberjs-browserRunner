CucumberJsBrowserRunnerStepDefinitions.testWorld(function () {
  
  var And = Given = When = Then = this.defineStep;

  this.World = function(callback) {
    callback();
      jQuery.ajax({
          url: 'features/support/testWorld.js',
          dataType: "script",
          success: function () {
              this.World = testWorld;
          },
          error : function () {
              console.error('unable to load world');
          }
      });
  };

  this.Before(function(callback) {
      alert(1);
  });
});