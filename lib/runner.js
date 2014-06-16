CucumberJsBrowserRunner = function (options) {

    var self = this,
        featureCount,
        featureCode = {},
        stepCode = {},
        backgroundCode = {},
        outputType = 'html',
        worldInstance,
        reportGenerator = new CucumberJsBrowserRunner.ReportGenerator();

    function parseQueryString(params) {
        params = params || {};
        location.search.replace(/[?&]([^=&#]+)(?:(=)([^&#]*))?/g, function (match, key, equals, value) {
            params[decodeURIComponent(key)] = equals ? decodeURIComponent(value) : undef;
            return match;
        });
        return params;
    };


    function loadScript(script, errorCallback) {
        var s = document.createElement('script');
        s.src = script;
        s.onerror = errorCallback;
        document.body.appendChild(s);
    }


    function loadBackgroundStepsDefinition(featureConfig, callback) {
        
        var backgroundStepsCount = featureConfig.backgroundSteps.length;
            completeCallback = function () {
                backgroundStepsCount--;
                if (backgroundStepsCount === 0) {
                    callback(self);
                }
            };

        featureConfig.backgroundSteps.forEach(function (backgroundStepName) {
            CucumberJsBrowserRunner.BackgroundStepDefinitions[backgroundStepName] = function (definition) {
                backgroundCode[backgroundStepName] = definition;
                delete(CucumberJsBrowserRunner.BackgroundStepDefinitions[backgroundStepName]);
                completeCallback();                
            };
            loadScript('features/step_definitions/' + backgroundStepName + '_background_steps.js', function () {
                console.error('Unable to load step definition for ' + backgroundStepName + ' feature.');
                delete(backgroundCode[backgroundStepName]);
                reportGenerator.addReport({
                    name : featureConfig.name,
                    elements : [],
                    status : 'failed',
                    message : 'Unable to load a background step definition for feature ' + featureConfig.name
                });
                completeCallback();
            });
        });


        
    }

    function loadStepDefinition(featureConfig, callback) {

        CucumberJsBrowserRunner.StepDefinitions[featureConfig.name] = function (definition) {
            stepCode[featureConfig.name] = definition;
            delete(CucumberJsBrowserRunner.StepDefinitions[featureConfig.name]);
            
            if (featureConfig.backgroundSteps) {
                loadBackgroundStepsDefinition(featureConfig, callback);
            } else {
                callback();
            }
            
        };
        loadScript('features/step_definitions/' + featureConfig.name + '_steps.js', function () {
            console.error('Unable to load step definition for ' + featureConfig.name + ' feature.');
            delete(featureCode[featureConfig.name]);
            reportGenerator.addReport({
                name : featureConfig.name,
                elements : [],
                status : 'failed',
                message : 'Unable to load a step definition for feature ' + featureConfig.name
            });
            callback();
        });
    };

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
            success : function( feature ) {
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

    self.setOutput = function (type) {
        outputType = type;
    }

    CucumberJsBrowserRunner.loadWorld = function (worldName, callback) {
        CucumberJsBrowserRunner.WorldDefinitions[worldName] = function (world) {
            worldInstance = world;
            CucumberJsBrowserRunner.WorldDefinitions[worldName] = world;
            callback(CucumberJsBrowserRunner.WorldDefinitions[worldName]);
        };
        loadScript('features/support/' + worldName + '.js', function () {});
    };


    self.loadFeatures = function (features, callback) {
        var featureCount = 0,
            completeCallback = function () {
                featureCount--;
                if (featureCount === 0) {
                    callback(self);
                }
            };

        if (Object.prototype.toString.call(features) === '[object Array]') {
            featureCount = features.length;
            features.forEach(function (feature) {
                loadFeature(feature, completeCallback);
            });
        } else {
            featureCount = 1;
            loadFeature(features, completeCallback);
        }
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

    function RunnerQueue(runCallback, completeCallback) {
        var queue = [],
            queueCallback = completeCallback,
            self = this;

        self.add = function (config) {
            queue.push(config);
        };
        self.checkQueue = function () {
            if (queue.length) {
                runCallback(queue.shift(), self.checkQueue);
            } else {
                queueCallback();
            }
        };
    }


    self.run = function (options) {
        var queue = new RunnerQueue(runCucumber, options.callback);
        for (var feature in featureCode) {
            if (options.features && options.features.indexOf(feature) === -1 ) {
                continue;
            }
            queue.add({
                feature : featureCode[feature],
                supportCode : stepCode[feature],
                tags : options.tags,
                customListeners : options.customListeners
            });
        }
        queue.checkQueue();

    };

    function prepareScenarioForCustomTestrun(featureCode, scenarioName) {
        var lines = featureCode.source.split(/\n/);
        var index = 0;
        lines.some(function(line){
            if(line.indexOf(scenarioName) > -1 ){
                return true;
            }
            index++;
        })
        lines.splice(index, 0, ['@customTestrun'].join(''));
        return lines.join('\n');  
    }

    var runCucumber = function (config, completeCallback) {

        if (parseQueryString().feature) {
            config.feature.source = prepareScenarioForCustomTestrun(config.feature, parseQueryString().feature);
            config.tags =  ['@customTestrun'];
        }else if (parseQueryString().scenario) {
            config.feature.source = prepareScenarioForCustomTestrun(config.feature, parseQueryString().scenario);
            config.tags = ['@customTestrun'];
        } else if (parseQueryString().tag) {
            config.tags = [parseQueryString().tag];
        }

        var customHtmlReporter = CucumberJsBrowserRunner.HTMLReport(config, self);

        var supportCode = config.supportCode;
        if (config.feature.background) {
            supportCode = function () {
                var cucScope = this;
                config.supportCode.call(cucScope);
                config.feature.background.forEach(function (backgroundStepCode) {
                    backgroundCode[backgroundStepCode].call(cucScope);
                });

            }
        }

        var configuration = Cucumber.VolatileConfiguration(config.feature.source, supportCode, { tags : config.tags});
        var runtime       = Cucumber.Runtime(configuration);

        var listener;
        if (outputType === 'html') {
            //listener = CucumberJsBrowserRunner.HTMLListener();
            runtime.attachListener(customHtmlReporter);
        } else {
            runtime.attachListener(CucumberJsBrowserRunner.ConsoleListener(config.customListeners || {}));
        }
        //runtime.attachListener(listener);

        runtime.attachListener(Cucumber.Listener.JsonFormatter({
            logToFunction : function (string) {
                console.log('report generated', JSON.parse(string)[0]);
                reportGenerator.addReport(JSON.parse(string)[0]);
                completeCallback();
            },
            logToConsole : false
        }));

        try {
            runtime.start(function() {});
        } catch(err) {
            console.error(err);
            console.log(err.stack);
        };
    }

};

CucumberJsBrowserRunner.StepDefinitions = {};
CucumberJsBrowserRunner.BackgroundStepDefinitions = {};
CucumberJsBrowserRunner.WorldDefinitions = {};

if (navigator.userAgent.indexOf("Trident") > -1) {

    if (!window.console) {
        window.console = {
            log : function () {}
        }
    }
    if (window.setImmediate) {
        window.setImmediate = undefined;
    }  
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, arg) {
            for(var i = 0, m = this.length; i < m; i++) {
                callback.call(arg, this[i], i, this)
            }
        }
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function() {
        
        var t = Object(this);
        var len = t.length;
        
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t))
                return true;
            }
            return false;
        };
    }
}


