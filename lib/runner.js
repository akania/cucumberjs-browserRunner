CucumberJsBrowserRunner = function (options) {

    var self = this,
        featureCount,
        featureCode = {},
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

        if (CucumberJsBrowserRunner.StepDefinitions[featureName]) {
            callback();
            return;
        }
        CucumberJsBrowserRunner.StepDefinitions[featureName] = function (definition) {
            CucumberJsBrowserRunner.StepDefinitions[featureName] = definition;
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

        if (featureCode[featureName]) {
            loadStepDefinition(featureName, callback);
            return;
        }

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
        CucumberJsBrowserRunner.WorldDefinitions[worldName] = function (world) {
            worldInstance = world;
            CucumberJsBrowserRunner.WorldDefinitions[worldName] = world;
            callback(CucumberJsBrowserRunner.WorldDefinitions[worldName]);
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

            var cucumber = Cucumber(featureCode[feature], CucumberJsBrowserRunner.StepDefinitions[feature], { tags : options.tags}),
                listener;
            if (outputType === 'html') {
                listener = CucumberJsBrowserRunner.HTMLListener();
            } else {
                listener = CucumberJsBrowserRunner.ConsoleListener(options.customListeners || {});
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

CucumberJsBrowserRunner.StepDefinitions = {};
CucumberJsBrowserRunner.WorldDefinitions = {};


