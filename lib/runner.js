/*globals window, location, navigator, document, Cucumber, CucumberJsBrowserRunner, jQuery, console*/
/*jslint vars:true, continue: true */
(function (win) {
    'use strict';

    win.CucumberJsBrowserRunner = function (options) {
        var self = this,
            featureCode = {},
            stepCode = {},
            backgroundCode = {},
            worldInstance,
            deafultTimeout = 10000,
            reportGenerator = new CucumberJsBrowserRunner.ReportGenerator(),
            customConsoleReporter = CucumberJsBrowserRunner.ConsoleListener(options);


        if (options && options.timeout) {
            Cucumber.Runtime.stepTimeoutValue = options.timeout;
        } else {
            Cucumber.Runtime.stepTimeoutValue = deafultTimeout;
        }

        function RunnerQueue(runCallback, completeCallback) {
            var queue = [],
                queueCallback = completeCallback,
                runnerInstance = this;

            runnerInstance.iterateOver = function (arr) {
                arr.forEach(function (item) {
                    runnerInstance.add(item);
                });
                runnerInstance.checkQueue();
            };

            runnerInstance.add = function (config) {
                queue.push(config);
            };
            runnerInstance.checkQueue = function () {
                if (queue.length) {
                    runCallback(queue.shift(), runnerInstance.checkQueue);
                } else {
                    queueCallback();
                }
            };
        }

        function getFromQueryString(name) {

            var queryString = location.search.substr(1).split("&"),
                params = {},
                i,
                temp,
                m;

            for (i = 0, m = queryString.length; i < m; i += 1) {
                temp = queryString[i].split('=');
                params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
            }

            return name ? params[name] : params;
        }


        function loadScript(script, errorCallback) {
            var s = document.createElement('script');
            s.src = script;
            s.onerror = errorCallback;
            document.body.appendChild(s);
        }


        function loadBackgroundStepsDefinition(featureConfig, callback) {

            var queue = new RunnerQueue(function (backgroundStepName, stepCallback) {

                if (backgroundCode[backgroundStepName]) {
                    stepCallback();
                    return;
                }

                CucumberJsBrowserRunner.BackgroundStepDefinitions[backgroundStepName] = function (definition) {
                    backgroundCode[backgroundStepName] = definition;
                    delete (CucumberJsBrowserRunner.BackgroundStepDefinitions[backgroundStepName]);
                    stepCallback();
                };
                loadScript('features/step_definitions/background/' + backgroundStepName + '_steps.js', function () {
                    console.error('Unable to load step definition for ' + backgroundStepName + ' feature.');
                    delete (backgroundCode[backgroundStepName]);
                    reportGenerator.addReport({
                        name : featureConfig.name,
                        elements : [],
                        status : 'failed',
                        message : 'Unable to load a background step definition for feature ' + featureConfig.name
                    });
                    stepCallback();
                });
            }, callback);

            queue.iterateOver(featureConfig.backgroundSteps);

        }

        function loadStepDefinition(featureConfig, callback) {

            CucumberJsBrowserRunner.StepDefinitions[featureConfig.name] = function (definition) {
                stepCode[featureConfig.name] = definition;
                delete (CucumberJsBrowserRunner.StepDefinitions[featureConfig.name]);
                if (featureConfig.backgroundSteps) {
                    loadBackgroundStepsDefinition(featureConfig, callback);
                } else {
                    callback();
                }
            };

            loadScript('features/step_definitions/' + featureConfig.name + '_steps.js', function () {
                console.error('Unable to load step definition for ' + featureConfig.name + ' feature.');
                delete (featureCode[featureConfig.name]);
                reportGenerator.addReport({
                    name : featureConfig.name,
                    elements : [],
                    status : 'failed',
                    message : 'Unable to load a step definition for feature ' + featureConfig.name
                });
                callback();
            });
        }

        function loadFeature(featureConfig, callback) {

            featureConfig = featureConfig.name ? featureConfig : { name : featureConfig };

            if (featureConfig.backgroundSteps) {
                if (Object.prototype.toString.call(featureConfig.backgroundSteps) !== '[object Array]') {
                    featureConfig.backgroundSteps = [featureConfig.backgroundSteps];
                }
            }

            if (featureCode[featureConfig.name]) {
                loadStepDefinition(featureConfig.name, callback);
                return;
            }

            jQuery.ajax({
                url : 'features/' + featureConfig.name + '.feature',
                type : 'GET',
                success : function (feature) {
                    featureCode[featureConfig.name] = { source : feature, background : featureConfig.backgroundSteps };
                    loadStepDefinition(featureConfig, callback);
                },
                error : function () {
                    console.error('Unable to load feature definition for ' + featureConfig.name + ' feature.');
                    reportGenerator.addReport({
                        name : featureConfig.name,
                        status : 'failed',
                        message : 'Unable to load a feature file'
                    });
                    callback();
                }
            });
        }

        self.debugConsoleOutput = customConsoleReporter.debugConsoleOutput;

        self.getConsoleOutput = function () {
            return JSON.stringify(customConsoleReporter.getConsoleOutput());
        };

        function prepareScenarioForCustomTestrun(featureCode, scenarioName) {
            var lines = featureCode.source.split(/\n/);
            var index = 0;
            lines.some(function (line) {
                if (line.indexOf(scenarioName) > -1) {
                    return true;
                }
                index += 1;
            });
            lines.splice(index, 0, ['@customTestrun'].join(''));
            return lines.join('\n');
        }

        function runCucumber(config, completeCallback) {

            var customHtmlReporter,
                configuration,
                supportCode,
                runtime;

            if (getFromQueryString('feature')) {
                config.feature.source = prepareScenarioForCustomTestrun(config.feature, getFromQueryString('feature'));
                config.tags =  ['@customTestrun'];
            } else if (getFromQueryString('scenario')) {
                config.feature.source = prepareScenarioForCustomTestrun(config.feature, getFromQueryString('scenario'));
                config.tags = ['@customTestrun'];
            } else if (getFromQueryString('tag')) {
                config.tags = [getFromQueryString('tag')];
            }

            customHtmlReporter = CucumberJsBrowserRunner.HTMLReport(config, self);

            supportCode = config.supportCode;

            if (config.feature.background) {
                supportCode = function () {
                    var cucScope = this;
                    config.supportCode.call(cucScope);
                    config.feature.background.forEach(function (backgroundStepCode) {
                        backgroundCode[backgroundStepCode].call(cucScope);
                    });
                };
            }

            configuration = Cucumber.VolatileConfiguration(config.feature.source, supportCode, { tags : config.tags});
            runtime = Cucumber.Runtime(configuration);

            runtime.attachListener(customHtmlReporter);
            runtime.attachListener(customConsoleReporter);

            runtime.attachListener(Cucumber.Listener.JsonFormatter({
                logToFunction : function (string) {
                    var result = JSON.parse(string);
                    if (Array.isArray(result) && result.length) {
                        console.log('report generated', result);
                        reportGenerator.addReport(result[0]);
                    }
                },
                logToConsole : false
            }));

            try {
                runtime.start(function () {
                    console.log('Finished');
                    completeCallback();
                });
            } catch (err) {
                console.error(err);
                console.log(err.stack);
            }
        }

        CucumberJsBrowserRunner.loadWorld = function (worldName, callback) {
            if (CucumberJsBrowserRunner.WorldDefinitions[worldName]) {
                callback(CucumberJsBrowserRunner.WorldDefinitions[worldName]);
            } else {
                CucumberJsBrowserRunner.WorldDefinitions[worldName] = function (world) {
                    worldInstance = world;
                    CucumberJsBrowserRunner.WorldDefinitions[worldName] = world;
                    callback(CucumberJsBrowserRunner.WorldDefinitions[worldName]);
                };
                loadScript('features/support/' + worldName + '.js');
            }
        };


        self.loadFeatures = function (features, callback) {

            if (Object.prototype.toString.call(features) !== '[object Array]') {
                features = [features];
            }

            var completeCallback = function () {
                callback(self);
            };

            var queue = new RunnerQueue(function (feature, stepCallback) {
                loadFeature(feature, stepCallback);
            }, completeCallback);

            queue.iterateOver(features);

        };


        self.getFeature = function (featureName) {
            return featureCode[featureName].source;
        };

        self.getAllFeatures = function () {
            return featureCode;
        };

        self.getFeatureStepDefinitions = function (featureName) {
            return stepCode[featureName];
        };

        self.getFeatureBackgroundStepDefinitions = function (featureName) {
            return backgroundCode[featureName];
        };


        self.getReport = reportGenerator.getReport;

        self.getWorldInstance = function () {
            return worldInstance;
        };

        self.run = function (options) {
            var queue = new RunnerQueue(runCucumber, options.callback),
                feature;
            for (feature in featureCode) {
                if (featureCode.hasOwnProperty(feature)) {
                    if (options.features && options.features.indexOf(feature) === -1) {
                        continue;
                    }
                    queue.add({
                        feature : featureCode[feature],
                        supportCode : stepCode[feature],
                        tags : options.tags,
                        customListeners : options.customListeners
                    });
                }
            }
            queue.checkQueue();

        };
    };

    CucumberJsBrowserRunner.StepDefinitions = {};
    CucumberJsBrowserRunner.BackgroundStepDefinitions = {};
    CucumberJsBrowserRunner.WorldDefinitions = {};

    if (navigator.userAgent.indexOf("Trident") > -1) {

        if (!window.console) {
            window.console = {
                log : function () {
                    return true;
                }
            };
        }
        if (window.setImmediate) {
            window.setImmediate = undefined;
        }

        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function (callback, arg) {
                var i, m;
                for (i = 0, m = this.length; i < m; i += 1) {
                    callback.call(arg, this[i], i, this);
                }
            };
        }
        if (!Array.prototype.some) {
            Array.prototype.some = function (fun) {

                var t = Object.create(this),
                    first = 1,
                    len = t.length,
                    thisArg,
                    i;

                thisArg = arguments.length >= 2 ? arguments[first] : undefined;
                for (i = 0; i < len; i += 1) {
                    if (t.hasOwnProperty(i) && fun.call(thisArg, t[i], i, t)) {
                        return true;
                    }
                }
                return false;
            };
        }

        if (!Array.isArray) {
            Array.isArray = function (args) {
                return Object.prototype.toString.call(args) === '[object Array]';
            };
        }
    }

}(window));
