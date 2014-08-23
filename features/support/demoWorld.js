CucumberJsBrowserRunner.WorldDefinitions.demoWorld(function () {
    var self = this;
    self.property = 1;
    self.method = function () {
        return priv;
    }

    self.incrementProperty = function () {
        self.property++;
    };
    self.asyncIncrementProperty = function (callback) {
        setTimeout(function () {
            self.property++;
            callback();
        }, 500);
    };

    self.throwException = function () {
        nonExistingFunction();
    };
});