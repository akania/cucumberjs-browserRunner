var CucumberHTMLListener;
(function($) {

    CucumberReportGenerator = function(runner) {

        if (!runner.reports) {
            runner.reports = {
                features : []
            };
        }
        var currentFeature = '',
            currentScenario = '',
            currentStep = '';

        function handleStepResult() {
            currentScenario.status = currentStep.result.status;
            if (currentStep.result.status !== 'passed') {
                currentFeature.status = 'failed';
            } else {
                currentFeature.status = 'passed';
            }
        }

        var self = {
            hear: function hear(event, callback) {
                var eventName = event.getName();
                switch (eventName) {
                    case 'BeforeFeature':
                        var feature = event.getPayloadItem('feature'),
                            featureDetails = {
                                name : feature.getName(),
                                description : feature.getDescription(),
                                scenarios : []
                            };
                        currentFeature = featureDetails;
                        runner.reports.features.push(featureDetails);
                        break;

                    case 'BeforeScenario':
                        var scenario = event.getPayloadItem('scenario'),
                            scenarioDetails = {
                                name        : scenario.getName(),
                                description : scenario.getDescription(),
                                steps : []
                            };
                        currentScenario = scenarioDetails;
                        currentFeature.scenarios.push(scenarioDetails);
                        break;

                    case 'BeforeStep':
                        var step = event.getPayloadItem('step'),
                            stepDetails = {
                                name        : step.getName()
                            };
                        currentStep = stepDetails;
                        currentScenario.steps.push(stepDetails);
                        break;

                    case 'StepResult':
                        var result,
                            stepResult = event.getPayloadItem('stepResult');

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
                        currentStep.result = result;
                        handleStepResult();
                        break;
                }
                callback();
            }
        };
        return self;
    };

    CucumberConsoleListener = function(customListeners) {
        customListeners = customListeners || {};
        var self = {
            hear: function hear(event, callback) {
                var eventName = event.getName();
                switch (eventName) {
                    case 'BeforeFeature':
                        var feature = event.getPayloadItem('feature');
                        if (customListeners['BeforeFeature']) {
                            customListeners['BeforeFeature'](feature);
                        }
                        break;
                    case 'AfterFeature':
                        var feature = event.getPayloadItem('feature');
                        if (customListeners['AfterFeature']) {
                            customListeners['AfterFeature'](feature);
                        }
                        break;
                    case 'BeforeScenario':
                        var scenario = event.getPayloadItem('scenario');
                        if (customListeners['BeforeScenario']) {
                            customListeners['BeforeScenario'](scenario);
                        }
                        break;
                    case 'BeforeStep':
                        var step = event.getPayloadItem('step');
                        if (customListeners['BeforeStep']) {
                            customListeners['BeforeStep'](step);
                        }
                        break;
                    case 'StepResult':
                        var result;
                        var stepResult = event.getPayloadItem('stepResult');
                        if (customListeners['StepResult']) {
                            customListeners['StepResult'](stepResult);
                        }
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

        var output          = $('#output'),
            errors          = $('#errors'),
            errorsContainer = $('#errors-container'),
            $output         = $('#output'),
            CucumberHTML = window.CucumberHTML,
            formatter    = new CucumberHTML.DOMFormatter($output),
            currentStep;

        //$output.empty();

        formatter.uri('report.feature');

        errors.text('');
        errorsContainer.hide();

        var self = {
            hear: function hear(event, callback) {
                var eventName = event.getName();
                switch (eventName) {
                    case 'BeforeFeature':
                        var feature = event.getPayloadItem('feature');
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
CucumberJsBrowserRunnerWorldDefinitions = {};
CucumberJsBrowserRunner = function () {

    var self = this,
        featureCode = {},
        supportCode,
        outputType = 'html',
        worldInstance;

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


    self.getReport = function () {
        return self.reports;
    };


    CucumberJsBrowserRunner.loadWorld = function (worldName, callback) {
        CucumberJsBrowserRunnerWorldDefinitions[worldName] = function (world) {
            worldInstance = world;
            CucumberJsBrowserRunnerWorldDefinitions[worldName] = world;
            callback(CucumberJsBrowserRunnerWorldDefinitions[worldName]);
        };
        loadScript('features/support/' + worldName + '.js', function () {});
    };

    self.getWorldInstance = function () {
        return worldInstance;
    };

    self.loadFeatures = function (featureName, callback, errorCallback) {

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
    };

    self.run = function (featureName, customListeners) {

  /*      var features = [];
        for (var feature in featureCode) {
            if (featureName) {
                if (featureName === feature) {
                    features.push([feature,featureCode[feature]]);
                }
            } else {
                features.push([feature,featureCode[feature]]);
            }
        }
//
        var stepDefinitons = function () {
            for (var feature in featureCode) {
                if (featureName) {
                    if (featureName === feature) {
                        CucumberJsBrowserRunnerStepDefinitions[feature].call(this);
                    }
                } else {
                    CucumberJsBrowserRunnerStepDefinitions[feature].call(this);
                }
            }
        }
//
        for (var f = 0, m = features.length; f < m; f++) {

        };
*/

        for (var feature in featureCode) {

            var cucumber = Cucumber(featureCode[feature], CucumberJsBrowserRunnerStepDefinitions[feature]),
                listener;
            if (outputType === 'html') {
                listener = CucumberHTMLListener();
            } else {
                listener = CucumberConsoleListener(customListeners);
            }

            cucumber.attachListener(listener);
            cucumber.attachListener(CucumberReportGenerator(self));

            cucumber.attachListener(Cucumber.Listener.JsonFormatter({
                logToFunction : function (string) {
                    console.log('JSON report :', JSON.parse(string));
                },
                logToConsole : false
            }));

            try {
                cucumber.start(function() {});
            } catch(err) {
                console.error(err);
            };

        }

    };


};

