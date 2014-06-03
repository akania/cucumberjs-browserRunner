CucumberJsBrowserRunner.ConsoleListener = function(customListeners) {
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