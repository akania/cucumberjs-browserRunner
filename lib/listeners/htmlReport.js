/*globals window, location, navigator, document, $, Cucumber, CucumberJsBrowserRunner, jQuery, console*/
/*jslint vars:true, continue: true, nomen: true */
(function () {

    'use strict';

    var output,
        currentFeatureElement,
        currentScenarioElement,
        currentStepElement,
        scenarioResult = '',
        initialized = false,
        displayAllDetails,
        globalStartTime;

    function checkOption() {
        return document.cookie.indexOf("displayAllDetails" + '=1') > -1 || false;
    }
    function setOption(name) {
        document.cookie = name + '=1; expires=Fri, 13 Jan 2111 13:13:13 UTC; path=/';
    }
    function removeOption(name) {
        document.cookie = name + '=0; expires=Fri, 13 Jan 2111 13:13:13 UTC; path=/';
    }

    displayAllDetails = checkOption("displayAllDetails");

    function initialize() {
        output = $('#cucumberjs-htmlreport');
        $('#cucumberjs-htmlreport').on('click', '.scenariosList >li > h2', function () {
            var scenarioNode = $(this.parentNode).find('.scenarioDetails');
            if (scenarioNode.is(':visible')) {
                scenarioNode.addClass('displayNone');
                removeOption('displayAllDetails');
            } else {
                scenarioNode.removeClass('displayNone');
                setOption('displayAllDetails');
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
        if (checkOption('displayAllDetails')) {
            $('#displayAll').attr('checked', true);
        }
        $('#displayAll').change(function () {
            if ($(this).is(':checked')) {
                $('.scenarioDetails').removeClass('displayNone');
                displayAllDetails = true;
                setOption('displayAllDetails');
            } else {
                $('.scenarioDetails').addClass('displayNone');
                displayAllDetails = false;
                removeOption('displayAllDetails');
            }
        });

        initialized = true;
    }

    function reportGetValue(type) {
        return parseInt($('.cucjs-html .results [data-type=' + type + ']').text(), 10);
    }
    function reportSetValue(type, value) {
        $('.cucjs-html .results [data-type=' + type + ']').text(value);
    }

    function reportIncrease(type) {
        var value = (reportGetValue(type)) + 1;
        reportSetValue(type, value);
    }
    function reportDecrease(type) {
        var value = (reportGetValue(type)) - 1;
        reportSetValue(type, value);
    }

    function addFeature(feature) {
        reportIncrease('featureCount');
        reportIncrease('featurePending');
        currentFeatureElement = $('<div>' +
            '<h1><span class="bold">Feature:</span>' + feature.getName() +
            '<span data-action="runFeature" class="hidden detail">run this feature</span>' +
            '</h1>' +
            '<p class="description"></p>' +
            '<p class="background" style="display:none">Background:</p>' +
            '<ul class="scenariosList" data-type="scenariosList"></ul></div>').appendTo(output);
        currentFeatureElement.find('[data-action=runFeature]').click(function () {
            location.href = location.protocol + '//' + location.host + location.pathname + '?feature=' + feature.getName();
        });

        if (feature.getDescription()) {
            currentFeatureElement.find('.description').text(feature.getDescription());
        }

    }

    function addBackground(background) {
        $('<span>' + background.getName() + '</span>').appendTo(currentFeatureElement.find('.background'));
        $('<p>' + background.getDescription() + '</p>').appendTo(currentFeatureElement.find('.background'));
        currentFeatureElement.find('.background').show();
    }

    function addScenario(scenario) {
        reportIncrease('scenarioCount');
        reportIncrease('scenarioPending');
        currentScenarioElement = $('<li class="collapsed">' +
            '<p class="tags"></p>' +
            '<h2><span class="bold">Scenario:</span>' + scenario.getName() + '<span data-action="runScenario" class="hidden detail">run this scenario</span></h2>' +
            '<div class="scenarioDetails ' + (displayAllDetails ? '' : 'displayNone') + '"><p class="description"></p>' +
            '<ul class="stepsList" data-type="stepsList"></ul></div></li>').appendTo(currentFeatureElement.find('[data-type=scenariosList]'));

        currentScenarioElement.find('.description').text(scenario.getDescription());

        if (scenario.getOwnTags().length) {
            scenario.getOwnTags().forEach(function (tag) {
                if (tag.getName() !== '@customTestrun') {
                    currentScenarioElement.find('.tags').append('<span>' + tag.getName() + '</span>');
                }
            });
        }

        currentScenarioElement.find('[data-action=runScenario]').click(function () {
            // reload and run only this scenario
            location.href = location.protocol + '//' + location.host + location.pathname + '?scenario=' + scenario.getName();
        });
        currentScenarioElement.find('.tags span').click(function () {
            // reload and run only scenarios with this tag
            location.href = location.protocol + '//' + location.host + location.pathname + '?tag=' + this.textContent;
        });
    }

    function addStep(step) {
        reportIncrease('stepsCount');
        reportIncrease('stepsPending');
        currentStepElement = $('<li class="pending"><h3><span class="bold">' + step.getKeyword() + '</span>' + step.getName() + '</h3><div class="details"></div><div class="errorDetails"></div></li>').appendTo(currentScenarioElement.find('[data-type=stepsList]'));
        if (step.hasDataTable()) {
            var table = $('<table>').appendTo(currentStepElement.find('.details'));
            var header = $('<tr>').appendTo(table);
            step.getDataTable().getRows().forEach(function (row) {
                row.raw().forEach(function (name) {
                    $('<th>' + name + '</th>').appendTo(header);
                });

                var rows = step.getDataTable().rows();
                rows.forEach(function (row) {
                    var tableRow = $('<tr>').appendTo(table);
                    row.forEach(function (data) {
                        $('<td>' + data + '</td>').appendTo(tableRow);
                    });
                });
            });
        }
    }

    function setStepResult(stepResult) {

        if (stepResult.getStep().isHidden()) {
            return;
        }


        reportDecrease('stepsPending');
        if (scenarioResult !== 'failed') {
            if (stepResult.isSuccessful()) {
                currentStepElement.attr('class', 'passed');
                scenarioResult = 'passed';
                reportIncrease('stepsPassed');
            } else if (stepResult.isPending()) {
                currentStepElement.attr('class', 'pending');
                scenarioResult = 'pending';
            } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
                currentStepElement.attr('class', 'skipped');
                scenarioResult = 'skipped';
                reportIncrease('stepsSkipped');
            } else {
                reportIncrease('stepsFailed');
                var error = stepResult.getFailureException();
                var errorMessage = error.stack || error;
                currentStepElement.attr('class', 'failed');
                scenarioResult = 'failed';
                currentStepElement.find('.errorDetails').text(errorMessage);
                currentScenarioElement.find('.scenarioDetails').show();
            }
        }
    }

    function setTestDuration(duration) {
        $('.cucjs-html .results span.duration').text(duration + ' seconds...');
    }

    CucumberJsBrowserRunner.HTMLReport = function (runner) {

        if (!initialized) {
            initialize();
        }
        var endTime;
        function reportTimeStart() {
            if (!globalStartTime) {
                globalStartTime = new Date();
            }
        }
        function reportTimeStop() {
            endTime = new Date();
        }
        function updateTestExecutionTime() {
            reportTimeStop();
            var time = '';
            var seconds = (endTime - globalStartTime) / 1000;
            time = seconds;
            if (seconds > 60) {
                time = parseInt(seconds / 60, 10) + ':' + parseInt(seconds % 60, 10);
            }
            setTestDuration(time);
        }
        var self = {
            hear: function hear(event, callback) {
                var eventName = event.getName(),
                    scenario;
                switch (eventName) {
                case 'BeforeFeatures':
                    reportTimeStart();
                    break;
                case 'BeforeFeature':
                    var feature = event.getPayloadItem('feature');
                    addFeature(feature);
                    break;
                case 'Background':
                    var background = event.getPayloadItem('background');
                    addBackground(background);
                    break;
                case 'BeforeScenario':
                    scenario = event.getPayloadItem('scenario');
                    addScenario(scenario, runner);
                    break;
                case 'AfterScenario':
                    scenario = event.getPayloadItem('scenario');
                    currentScenarioElement.addClass(scenarioResult);
                    reportDecrease('scenarioPending');
                    if (scenarioResult === 'passed') {
                        reportIncrease('scenarioPassed');
                    } else if (scenarioResult === 'failed') {
                        reportIncrease('scenarioPassed');
                    } else {
                        reportIncrease('scenarioSkipped');
                    }
                    scenarioResult = '';
                    break;
                case 'BeforeStep':
                    updateTestExecutionTime();
                    var step = event.getPayloadItem('step');
                    addStep(step);
                    break;
                case 'StepResult':
                    updateTestExecutionTime();
                    var stepResult = event.getPayloadItem('stepResult');
                    setStepResult(stepResult);
                    break;
                case 'AfterFeatures':
                    updateTestExecutionTime();
                    break;
                }
                callback();
            }
        };
        return self;
    };

}());