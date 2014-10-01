CucumberJsBrowserRunner.StepDefinitions.slowFeature(function () {

    var Step = this.defineStep;

    Step(/^slow test$/, function(callback) {
        setTimeout(callback, 500);
    });
});