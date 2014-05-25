(function($) {
    var CucumberHTMLListener = function($root) {
    var CucumberHTML = window.CucumberHTML;
    var formatter    = new CucumberHTML.DOMFormatter($root);

    formatter.uri('report.feature');

    var currentStep;

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

function runFeature() {

    new CucumberBrowserRunner('test', function (cuc) {

        var cucumber = cuc.run();
    
    /*jQuery.get('features/test.feature', function( feature ) {
        jQuery.ajax({
            url: 'features/step_definitions/test_steps.js',
            dataType: "script",
            success: function () {

                var Cucumber        = window.Cucumber;
*/
                //var supportCode;
                var output          = $('#output');
                var errors          = $('#errors');
                var errorsContainer = $('#errors-container');
                //var featureSource   = feature;
                //var supportCode     = test_steps;
                //var cucumber        = Cucumber(featureSource, supportCode);

                console.log('loaded', cucumber);
                window.mycucumber = cucumber;

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
            /*}
        });
    });*/
    });
};
$(function() {
    Gherkin = { Lexer: function() { return Lexer; } };
    $('#run-feature').click(runFeature);
    $('#errors-container').hide();
  });
})(jQuery);

var CucumberBrowserRunnerStepDefinitions = {};
var CucumberBrowserRunner = function (featureName, loadedCallback) {
    var self = this,
        featureCode,
        supportCode;

    var loadStepDefinition = function () {
        jQuery.ajax({
            url: 'features/step_definitions/' + featureName + '_steps.js',
            dataType: "script",
            success: function () {
                loadedCallback(self);
            }
        });
    };
    var loadFeatureDefinition = function () {
        jQuery.get('features/' + featureName + '.feature', function( feature ) {
            featureCode = feature;
            loadStepDefinition();
        });
    };
    var loadSupportCode = function (supportCode, callback) {

    };

    self.run = function () {
        return Cucumber(featureCode, CucumberBrowserRunnerStepDefinitions[featureName]);
    }

    loadFeatureDefinition();
}
