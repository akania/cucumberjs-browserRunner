CucumberJsBrowserRunner = function (options) {

    var self = this,
        featureCount,
        featureCode = {},
        stepCode = {},
        outputType = 'html',
        worldInstance,
        reportGenerator = new CucumberJsBrowserRunner.ReportGenerator();

    function loadScript(script, errorCallback) {
        var s = document.createElement('script');
        s.src = script;
        s.onerror = errorCallback;
        document.body.appendChild(s);
    }

    function loadStepDefinition(featureName, callback, errorCallback) {
        CucumberJsBrowserRunner.StepDefinitions[featureName] = function (definition) {
            stepCode[featureName] = definition;
            delete(CucumberJsBrowserRunner.StepDefinitions[featureName]);
            callback();
        };
        loadScript('features/step_definitions/' + featureName + '_steps.js', function () {
            console.error('Unable to load step definition for ' + featureName + ' feature.');
            delete(featureCode[featureName]);
            reportGenerator.addReport({
                name : featureName,
                elements : [],
                status : 'failed',
                message : 'Unable to load a step definition for feature ' + featureName
            });
            callback();
        });
    };

    function loadFeature(featureName, callback) {

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
                reportGenerator.addReport({
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

    CucumberJsBrowserRunner.loadWorld = function (worldName, callback) {
        CucumberJsBrowserRunner.WorldDefinitions[worldName] = function (world) {
            worldInstance = world;
            CucumberJsBrowserRunner.WorldDefinitions[worldName] = world;
            callback(CucumberJsBrowserRunner.WorldDefinitions[worldName]);
        };
        loadScript('features/support/' + worldName + '.js', function () {});
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

    self.getFeatureStepDefinitions = function (featureName) {
        return stepCode[featureName];
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


    var runCucumber = function (config, completeCallback) {
        var cucumber = Cucumber(config.feature, config.supportCode, { tags : config.tags}),
            listener;
        if (outputType === 'html') {
            listener = CucumberJsBrowserRunner.HTMLListener();
        } else {
            listener = CucumberJsBrowserRunner.ConsoleListener(config.customListeners || {});
        }
        cucumber.attachListener(listener);
        cucumber.attachListener(Cucumber.Listener.JsonFormatter({
            logToFunction : function (string) {
                reportGenerator.addReport(JSON.parse(string)[0]);
                completeCallback();
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

CucumberJsBrowserRunner.StepDefinitions = {};
CucumberJsBrowserRunner.WorldDefinitions = {};


