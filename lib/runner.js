var CucumberHTMLListener;
(function($) {

   
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

    
})(jQuery);

CucumberJsBrowserRunnerStepDefinitions = {};
CucumberJsBrowserRunnerWorldDefinitions = {};
CucumberJsBrowserRunner = function (options) {

    var self = this,
        featureCode = {},
        featureCount,
        supportCode,
        outputType = 'html',
        worldInstance,
        reports = [];

    var loadScript = function (script, errorCallback) {
        var s = document.createElement('script');
        s.src = script;
        s.onerror = errorCallback;
        document.body.appendChild(s);
    }

    var loadStepDefinition = function (featureName, callback, errorCallback) {

        if (CucumberJsBrowserRunnerStepDefinitions[featureName]) {
            callback();
            return;
        }
        CucumberJsBrowserRunnerStepDefinitions[featureName] = function (definition) {
            CucumberJsBrowserRunnerStepDefinitions[featureName] = definition;
            callback();
        };
        loadScript('features/step_definitions/' + featureName + '_steps.js', function () {
            console.error('Unable to load step definition for ' + featureName + ' feature.');
            delete(featureCode[featureName]);
            reports.push({
                name : featureName,
                elements : [],
                status : 'failed',
                message : 'Unable to load a step definition for feature ' + featureName
            });
            callback();
        });
    };

    var loadFeature = function (featureName, callback) {
        jQuery.ajax({
            url : 'features/' + featureName + '.feature',
            type : 'GET',
            success : function( feature ) {
                featureCode[featureName] = feature;
                loadStepDefinition(featureName, callback);
            },
            error : function () {
                console.error('Unable to load feature definition for ' + featureName + ' feature.');
                reports.push({
                    name : featureName,
                    status : 'failed',
                    message : 'Unable to load a feature file'
                });
                callback();
            }
        });
    }

    self.setOutput = function (type) {
        outputType = type;
    }


    var generateReport = function (reports) {
        var summaryResult = 'pending',
            failedFeatures = [],
            currentFeature,
            currentScenario,
            currentStep;

        if (!reports[0]) return summaryResult;

        reports.forEach(function (feature) {
            currentFeature = feature;
            if (feature.status === 'failed') {
                summaryResult = 'failed';
                return;
            }
            feature.elements.forEach(function (scenario) {
                currentScenario = scenario;
                scenario.steps.forEach(function (step) {
                    currentStep = step;
                    if (step.result.status !== 'passed') {
                        failedFeatures.push(currentFeature);
                    }
                });
            });
        });
        if (failedFeatures.length === 0) {
            summaryResult = 'passed';
        } else {
            summaryResult = 'failed';
        }
        return {
            summary : summaryResult,
            failedFeatures : failedFeatures
        };
    };
    self.getReport = function () {

        return {
            getFeature : function (featureName) {
                var result = null
                reports.forEach(function (feature) {
                    if (featureName === feature.name) {
                        result = feature;
                        result.getSummary = function (){
                            return generateReport([result]).summary;
                        };
                        return result;
                    }
                });
                
                return result;
            },
            getSummary : function () {
                return generateReport(reports).summary;
            },
            getFailed : function () {
                return generateReport(reports).failedFeatures;
            },
            reports : reports
        };
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

    self.loadFeatures = function (featureName, callback) {
        var featureCount = 0,
            completeCallback = function () {
                featureCount--;
                if (featureCount === 0) {
                    callback(self);
                }
            };

        if (Object.prototype.toString.call(featureName) === '[object Array]') {
            featureCount = featureName.length;
            featureName.forEach(function (feature) {
                loadFeature(feature, completeCallback);
            });
        } else {
            featureCount = 1;
            loadFeature(featureName, completeCallback);
        }
    };


    self.getFeature = function (featureName) {
        return featureCode[featureName];
    };

    self.run = function (options) {

        for (var feature in featureCode) {

            if (options.features && options.features.indexOf(feature) === -1 ) {
                continue;
            }

            var cucumber = Cucumber(featureCode[feature], CucumberJsBrowserRunnerStepDefinitions[feature], { tags : options.tags}),
                listener;
            if (outputType === 'html') {
                listener = CucumberJsBrowserRunner.HTMLListener();
            } else {
                listener = CucumberConsoleListener(options.customListeners || {});
            }

            cucumber.attachListener(listener);

            cucumber.attachListener(Cucumber.Listener.JsonFormatter({
                logToFunction : function (string) {
                    featureCount--;
                    reports.push(JSON.parse(string)[0]);
                    if (!featureCount) {
                        options.callback();
                    }
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

