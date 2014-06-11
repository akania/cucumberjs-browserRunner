(function () {

    var output,
        currentFeatureElement,
        currentScenarioElement,
        currentStepElement,
        scenarioResult = '',
        initialized = false;

    function initialize() {
        output = $('#cucumberjs-htmlreport');
        $('#cucumberjs-htmlreport').on('click', '.scenariosList >li > h2', function () {
            var scenarioNode = $(this.parentNode).find('.scenarioDetails');
            if (scenarioNode.is(':visible')) {
                scenarioNode.hide();
            } else {
                scenarioNode.show();
            }
        });

        $('#cucumberjs-htmlreport').on('mouseover', 'h1,h2', function () {
            $(this).find('.detail').removeClass('hidden');
            $(this).find('.detail').addClass('visible');
        });
        $('#cucumberjs-htmlreport').on('mouseout', 'h1,h2', function () {
            $(this).find('.detail').removeClass('visible');
            $(this).find('.detail').addClass('hidden');
        });


        initialized = true;
    }


    function addFeature(feature) {
        currentFeatureElement = $('<div><h1><span class="bold">Feature:</span>' + feature.getName() + '<span data-action="runFeature" class="hidden detail">run this feature</span></h1><ul class="scenariosList" data-type="scenariosList"></ul></div>').appendTo(output);
        currentFeatureElement.find('[data-action=runFeature]').click(function () {
            // reload and run only this scenario
            location.href = location.protocol+'//'+location.host+location.pathname + '?feature=' + feature.getName();
        });
    }

    function addScenario(scenario, runner) {
        currentScenarioElement = $('<li class="collapsed">'+
            '<p class="tags"></p>'+
            '<h2><span class="bold">Scenario:</span>' + scenario.getName() + '<span data-action="runScenario" class="hidden detail">run this scenario</span></h2>' +
            '<div class="scenarioDetails"><p class="description"></p>'+
            '<ul class="stepsList" data-type="stepsList"></ul></div></li>').appendTo(currentFeatureElement.find('[data-type=scenariosList]'));
        
        currentScenarioElement.find('.description').text(scenario.getDescription());

        if (scenario.getOwnTags().length) {
            scenario.getOwnTags().forEach(function(tag) {
                if (tag.getName() !== '@customTestrun') {
                    currentScenarioElement.find('.tags').append('<span>' + tag.getName() + '</span>');
                }
            });
        }
        

        currentScenarioElement.find('[data-action=runScenario]').click(function () {
            // reload and run only this scenario
            location.href = location.protocol+'//'+location.host+location.pathname + '?scenario=' + scenario.getName();
        });
        currentScenarioElement.find('.tags span').click(function () {
            // reload and run only this scenario
            location.href = location.protocol+'//'+location.host+location.pathname + '?tag=' + this.textContent;
        });
    }

    function addStep(step) {
        currentStepElement = $('<li class="pending"><h3><span class="bold">' + step.getKeyword() + '</span>' + step.getName() + '</h3><div class="details"></div><div class="errorDetails"></div></li>').appendTo(currentScenarioElement.find('[data-type=stepsList]'));
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
        if (scenarioResult !== 'failed') {
            if (stepResult.isSuccessful()) {
                currentStepElement.attr('class','passed');
                scenarioResult = 'passed';
            } else if (stepResult.isPending()) {
                currentStepElement.attr('class','pending');
                scenarioResult = 'pending';
            } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                currentStepElement.attr('class','skipped');
                scenarioResult = 'skipped';
            } else {
                var error = stepResult.getFailureException();
                var errorMessage = error.stack || error;
                currentStepElement.attr('class','failed');
                scenarioResult = 'failed';
                currentStepElement.find('.errorDetails').text(errorMessage);
                currentScenarioElement.find('.scenarioDetails').show();
            }
        }
    }

    CucumberJsBrowserRunner.HTMLReport = function(runner) {

        if (!initialized) {
            initialize();
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
                        break;

                    case 'BeforeScenario':
                        var scenario = event.getPayloadItem('scenario');
                        addScenario(scenario, runner);
                        console.log('BeforeScenario', scenario, scenario.getTags());
                        break;
                    case 'AfterScenario':
                        var scenario = event.getPayloadItem('scenario');
                        console.log('AfterScenario', scenario);
                        currentScenarioElement.addClass(scenarioResult);
                        scenarioResult = '';

                        break;
                    case 'BeforeStep':
                        var step = event.getPayloadItem('step');
                        console.log('BeforeStep', step, step.getName());
                        addStep(step);
                        break;

                    case 'StepResult':
                        var result;
                        var stepResult = event.getPayloadItem('stepResult');
                        console.log('StepResult', stepResult);
                        setStepResult(stepResult);
                        break;
                }
                callback();
            }
        };
        return self;
    };


})();