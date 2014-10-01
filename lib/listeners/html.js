/*globals window, location, navigator, document, $, Cucumber, CucumberJsBrowserRunner, jQuery, console*/
/*jslint vars:true, continue: true, nomen: true */
CucumberJsBrowserRunner.HTMLListener = function () {
    'use strict';
    var errors = $('#errors'),
        errorsContainer = $('#errors-container'),
        $output = $('#output'),
        CucumberHTML = window.CucumberHTML,
        formatter = new CucumberHTML.DOMFormatter($output),
        currentStep,
        self;

    formatter.uri('report.feature');

    errors.text('');
    errorsContainer.hide();

    self = {
        hear: function hear(event, callback) {
            var eventName = event.getName();
            switch (eventName) {
            case 'BeforeFeature':
                var feature = event.getPayloadItem('feature');
                formatter.feature({
                    keyword : feature.getKeyword(),
                    name : feature.getName(),
                    line : feature.getLine(),
                    description : feature.getDescription()
                });
                break;

            case 'BeforeScenario':
                var scenario = event.getPayloadItem('scenario');
                formatter.scenario({
                    keyword : scenario.getKeyword(),
                    name : scenario.getName(),
                    line : scenario.getLine(),
                    description : scenario.getDescription()
                });
                break;

            case 'BeforeStep':
                var step = event.getPayloadItem('step');
                self.handleAnyStep(step);
                break;

            case 'StepResult':
                var result,
                    error,
                    errorMessage,
                    stepResult = event.getPayloadItem('stepResult');

                if (stepResult.isSuccessful()) {
                    result = {status: 'passed'};
                } else if (stepResult.isPending()) {
                    result = {status: 'pending'};
                } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                    result = {status: 'skipped'};
                } else {
                    error = stepResult.getFailureException();
                    errorMessage = error.stack || error;
                    result = {status: 'failed', error_message: errorMessage};
                }
                formatter.match({uri: 'report.feature', step: {line: currentStep.getLine()}});
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