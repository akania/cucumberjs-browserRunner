CucumberJsBrowserRunner.ConsoleListener = function(options) {

    var consoleOutput = [],
        enableCapture = options && options.captureConsoleOutput || false;

    var consoleMethods = ['log', 'info', 'error', 'debug'];
    consoleMethods.forEach(function (method) {
        var realMethod = window.console[method];
        window.console[method] = function () {
            if (enableCapture) {
                var args = Array.prototype.slice.call(arguments),
                    output = [];
                args.forEach(function (argument) {
                    var arg = argument;
                    if (typeof argument === 'object') {
                        arg = JSON.stringify(argument);
                    }
                    output.push(arg);
                });              
                output.join(', ');
                consoleOutput.push({
                        type : method,
                        data : output
                });
            }
            realMethod.apply(window.console, arguments);
        }
    });

    var scenarioResult = '';
    var self = {
        debugConsoleOutput : function (output) {
            var parsed = JSON.parse(output),
                captured = enableCapture;
            enableCapture = false;
            parsed.forEach(function(l){ console[l.type](l.data.join())});
            enableCapture = captured;
        },
        getConsoleOutput : function () {
            return consoleOutput;
            
        },
        hear: function hear(event, callback) {
            var eventName = event.getName();
            switch (eventName) {
                case 'BeforeFeature':
                    var feature = event.getPayloadItem('feature');
                    console.log('CucumberJsBrowserRunner:Feature ' + feature.getName());
                    break;
                case 'BeforeScenario':
                    var scenario = event.getPayloadItem('scenario');
                    var tags = [];
                    scenario.getTags().forEach(function (tag) {
                        tags.push(tag.getName());
                    });
                    tags.join(', ');
                    console.log('CucumberJsBrowserRunner:Scenario ' + scenario.getName() + ' ' + tags);
                    break;
                case 'BeforeStep':
                    var step = event.getPayloadItem('step');
                    console.log('CucumberJsBrowserRunner:Step ' + step.getName());
                    break;
                case 'AfterScenario':
                    console.log('CucumberJsBrowserRunner:Scenario result ' + scenarioResult);
                    break;
                case 'StepResult':
                    var stepResult = event.getPayloadItem('stepResult');
                    if (scenarioResult !== 'failed') {
                        if (stepResult.isSuccessful()) {
                            scenarioResult = 'passed';
                            console.info('passed');
                        } else if (stepResult.isPending()) {
                            scenarioResult = 'pending';
                            console.log('pending');
                        } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                            scenarioResult = 'skipped';
                            console.warn('skipped');
                        } else {
                            var error = stepResult.getFailureException();
                            var errorMessage = error.stack || error;
                            scenarioResult = 'failed : ' + error;
                            console.error('Failed', errorMessage);
                        }
                    }
                    break;
            }
            callback();
        }
    };
    return self;

};