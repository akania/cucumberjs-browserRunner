CucumberJsBrowserRunner.HTMLReport = function() {

    var output = $('#cucumberjs-htmlreport'),
        currentFeatureElement,
        currentScenarioElement,
        currentStepElement;

    function addFeature(feature) {
        currentFeatureElement = $('<div><h1><span class="bold">Feature:</span>' + feature.getName() + '</h1><ul class="scenariosList" data-type="scenariosList"></ul></div>').appendTo(output);
    }

    function addScenario(scenario) {
        currentScenarioElement = $('<li><h2><span class="bold">Scenario:</span>' + scenario.getName() + '</h2><ul class="stepsList" data-type="stepsList"></ul></li>').appendTo(currentFeatureElement.find('[data-type=scenariosList]'));
    }

    function addStep(step) {
        currentStepElement = $('<li class="pending"><h3><span class="bold">' + step.getKeyword() + '</span>' + step.getName() + '</h3><div class="details"></div></li>').appendTo(currentScenarioElement.find('[data-type=stepsList]'));
        if (step.hasDataTable()) {
            var table = $('<table>').appendTo(currentStepElement.find('.details'));
            var header = $('<tr>').appendTo(table);
            step.getDataTable().getRows().forEach(function(row){
                row.raw().forEach(function (name) {
                    $('<th>' + name + '</th>').appendTo(header);
                });

                var rows = step.getDataTable().rows();
                rows.forEach(function (row) {
                    var tableRow = $('<tr>').appendTo(table);
                    row.forEach(function (data) {
                        $('<td>' + data + '</td>').appendTo(tableRow);
                    });
                })
            })
        }
    }

    function setStepResult(stepResult) {
        if (stepResult.isSuccessful()) {
            currentStepElement.attr('class','passed');
        } else if (stepResult.isPending()) {
            currentStepElement.attr('class','pending');
        } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
            currentStepElement.attr('class','skipped');
        } else {
            var error = stepResult.getFailureException();
            var errorMessage = error.stack || error;
            currentStepElement.attr('class','failed');
        }
    }

    
       
    var self = {
        hear: function hear(event, callback) {
            var eventName = event.getName();
            console.log(eventName)
            switch (eventName) {
                case 'BeforeFeature':
                    var feature = event.getPayloadItem('feature');
                    addFeature(feature);
                    console.log('BeforeFeature', feature, feature.getTags());
                    /*formatter.feature({
                        keyword     : feature.getKeyword(),
                        name        : feature.getName(),
                        line        : feature.getLine(),
                        description : feature.getDescription()
                    });*/
                    break;

                case 'BeforeScenario':
                    var scenario = event.getPayloadItem('scenario');
                    addScenario(scenario);
                    console.log('BeforeScenario', scenario, scenario.getTags());
                    /*formatter.scenario({
                        keyword     : scenario.getKeyword(),
                        name        : scenario.getName(),
                        line        : scenario.getLine(),
                        description : scenario.getDescription()
                    });*/
                    break;
                case 'AfterScenario':
                    var scenario = event.getPayloadItem('scenario');
                    console.log('AfterScenario', scenario);
                    break;
                case 'BeforeStep':
                    var step = event.getPayloadItem('step');
                    console.log('BeforeStep', step, step.getName());
                    addStep(step);
                    //self.handleAnyStep(step);
                    break;

                case 'StepResult':
                    var result;
                    var stepResult = event.getPayloadItem('stepResult');
                    console.log('StepResult', stepResult);
                    setStepResult(stepResult);
                    /*
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
                    formatter.result(result);*/
                    break;
            }
            callback();
        },

        handleAnyStep: function handleAnyStep(step) {
            /*formatter.step({
                keyword: step.getKeyword(),
                name   : step.getName(),
                line   : step.getLine()
            });*/
        }
    };
    return self;
};