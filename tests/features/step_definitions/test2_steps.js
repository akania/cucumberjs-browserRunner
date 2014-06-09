CucumberJsBrowserRunner.StepDefinitions.test2(function () {

    var And = Given = When = Then = this.defineStep,
        runner;

    Given(/^test$/, function(callback) {
        callback();
    });
    When(/^test$/, function(callback) {
        callback();
    });
    Then(/^test$/, function(callback) {
        callback();
    });

    Given(/^the following users exist$/, function (data, callback) {
        console.log('data', data);
        callback();
    }); 
});