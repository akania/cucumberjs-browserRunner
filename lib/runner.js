var CucumberHTMLListener;
(function($) {

    CucumberConsoleListener = function() {
        
        var self = {
            hear: function hear(event, callback) {
                var eventName = event.getName();
                switch (eventName) {
                    case 'BeforeFeature':
                        var feature = event.getPayloadItem('feature');
                        console.log('feature', feature);
                        break;

                    case 'BeforeScenario':
                        var scenario = event.getPayloadItem('scenario');
                        console.log('BeforeScenario', scenario);
                        break;

                    case 'BeforeStep':
                        var step = event.getPayloadItem('step');
                        console.log('BeforeStep', step);
                        break;

                    case 'StepResult':
                        var result;
                        var stepResult = event.getPayloadItem('stepResult');
                        if (stepResult.isSuccessful()) {
                            result = {status: 'passed'};
                        } else if (stepResult.isPending()) {
                            result = {status: 'pending'};
                        } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                            result = {status:'skipped'};
                        } else {
                        var error = stepResult.getFailureException();
                        var errorMessage = error.stack || error;
                            result = {status: 'failed', error_message: errorMessage};
                        }
                        console.log('StepResult', result);
                        break;
                }
                callback();
            },
            handleAnyStep: function handleAnyStep(step) {
                formatter.step({
                    keyword: step.getKeyword(),
                    name   : step.getName(),
                    line   : step.getLine()
                });
                currentStep = step;
            }
        };
        return self;
    };

    CucumberHTMLListener = function($root) {
        var CucumberHTML = window.CucumberHTML;
        var formatter    = new CucumberHTML.DOMFormatter($root);
        var currentStep;

        formatter.uri('report.feature');
        
        var self = {
            hear: function hear(event, callback) {
                var eventName = event.getName();
                switch (eventName) {
                    case 'BeforeFeature':
                        var feature = event.getPayloadItem('feature');

                        console.log('feature', feature);

                        formatter.feature({
                            keyword     : feature.getKeyword(),
                            name        : feature.getName(),
                            line        : feature.getLine(),
                            description : feature.getDescription()
                        });
                        break;

                    case 'BeforeScenario':
                        var scenario = event.getPayloadItem('scenario');
                        formatter.scenario({
                            keyword     : scenario.getKeyword(),
                            name        : scenario.getName(),
                            line        : scenario.getLine(),
                            description : scenario.getDescription()
                        });
                        break;

                    case 'BeforeStep':
                        var step = event.getPayloadItem('step');
                        self.handleAnyStep(step);
                        break;

                    case 'StepResult':
                        var result;
                        var stepResult = event.getPayloadItem('stepResult');
                        if (stepResult.isSuccessful()) {
                            result = {status: 'passed'};
                        } else if (stepResult.isPending()) {
                            result = {status: 'pending'};
                        } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                            result = {status:'skipped'};
                        } else {
                        var error = stepResult.getFailureException();
                        var errorMessage = error.stack || error;
                            result = {status: 'failed', error_message: errorMessage};
                        }
                        formatter.match({uri:'report.feature', step: {line: currentStep.getLine()}});
                        formatter.result(result);
                        break;
                }
                callback();
            },

            handleAnyStep: function handleAnyStep(step) {
                formatter.step({
                    keyword: step.getKeyword(),
                    name   : step.getName(),
                    line   : step.getLine()
                });
                currentStep = step;
            }
        };
        return self;
    };
})(jQuery);

CucumberJsBrowserRunnerStepDefinitions = {};
CucumberJsBrowserRunner = function () {

    var self = this,
        featureCode = {},
        supportCode,
        outputType = 'html';

    var loadScript = function (script, errorCallback) {
        var s = document.createElement('script');
        s.src = script;
        s.onerror = errorCallback;
        document.body.appendChild(s);
    }

    var loadStepDefinition = function (featureName, callback, errorCallback) {
        CucumberJsBrowserRunnerStepDefinitions[featureName] = function (definition) {
            CucumberJsBrowserRunnerStepDefinitions[featureName] = definition;
            callback.featureCount--;
            if (!callback.featureCount) {
                callback(self);
            }
        };
        loadScript('features/step_definitions/' + featureName + '_steps.js', errorCallback);
    };

    var loadFeature = function (featureName, callback, errorCallback) {
        jQuery.ajax({
            url : 'features/' + featureName + '.feature',
            type : 'GET',
            success : function( feature ) {
                featureCode[featureName] = feature;
                loadStepDefinition(featureName, callback, errorCallback);
            }, 
            error : function () {
                console.error('Unable to load feature');
                errorCallback();
            }
        });
    }

    self.setOutput = function (type) {
        outputType = type;
    }

    self.loadWorld = function (worldName, callback, errorCallback) {
        CucumberJsBrowserRunnerStepDefinitions[worldName] = function (world) {
            CucumberJsBrowserRunnerStepDefinitions[worldName] = world;
            callback(CucumberJsBrowserRunnerStepDefinitions[worldName]);
        };
        loadScript('features/support/' + worldName + '.js', errorCallback);
    }

    self.loadFeature = function (featureName, callback, errorCallback) {

        if (Object.prototype.toString.call(featureName) === '[object Array]') {
            callback.featureCount = featureName.length;
            for (var i = featureName.length - 1; i >= 0; i--) {
                loadFeature(featureName[i], callback, errorCallback);
            };
        } else {
            callback.featureCount = 1;
            loadFeature(featureName, callback, errorCallback);
        }
        
    };


    self.getFeature = function (featureName) {
        return featureCode[featureName];
    }

    self.run = function (featureName) {

        var output          = $('#output');
        var errors          = $('#errors');
        var errorsContainer = $('#errors-container');
        if (outputType === 'html') {
           
            var cucumber = Cucumber(featureCode[featureName], CucumberJsBrowserRunnerStepDefinitions[featureName]);

            var $output         = $('#output');
            $output.empty();
            var listener        = CucumberHTMLListener($output);
            cucumber.attachListener(listener);

            errors.text('');
            errorsContainer.hide();
        } else {
            var cucumber = Cucumber(featureCode[featureName], CucumberJsBrowserRunnerStepDefinitions[featureName]);

            cucumber.attachListener(CucumberConsoleListener());    
        }

        try {
            cucumber.start(function() {});
        } catch(err) {

            errorsContainer.show();
            var errMessage = err.message || err;
            var buffer = (errors.text() == '' ? errMessage : errors.text() + "\n\n" + errMessage);
            errors.text(buffer);
            throw err;
        };

    }

    /*
    self.run = function (featureName) {

        var output          = $('#output');
        var errors          = $('#errors');
        var errorsContainer = $('#errors-container');
        var cucumber = Cucumber(featureCode[featureName], CucumberJsBrowserRunnerStepDefinitions[featureName]);

        var $output         = $('#output');
        $output.empty();
        var listener        = CucumberHTMLListener($output);
        cucumber.attachListener(listener);

        errors.text('');
        errorsContainer.hide();
        try {
            cucumber.start(function() {});
        } catch(err) {
            errorsContainer.show();
            var errMessage = err.message || err;
            var buffer = (errors.text() == '' ? errMessage : errors.text() + "\n\n" + errMessage);
            errors.text(buffer);
            throw err;
        };

    }*/

};