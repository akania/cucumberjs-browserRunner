CucumberJsBrowserRunner.StepDefinitions.async(function () {

    var And = Given = When = Then = this.defineStep;
    var value = 1;
    this.Before(function (callback) {
        console.log('before');
        this.counter = value++;
        callback();
    });

    Given(/^test$/, function(callback) {
        console.log('given');
        callback();
    });

    When(/^I call and wait with value '(.*)'$/, function (value, callback) {
        console.log('when called');
        
        setTimeout(function () {
            console.log('when finished');
            callback();
        }, 2100);
    });
    Then(/^I get value '(.*)'$/, function (value, callback) {
        console.log('then');
        console.log('this.counter',this.counter,'value',value)
        if (this.counter == value)
            callback();
        else
            callback.fail();
    });

});