CucumberJsBrowserRunner.ReportGenerator = function() {
    
    var testReports = [],
        self = this;
    

    function generateReport(reports) {
        var summaryResult = 'pending',
            failedSummary = [],
            failedFeatures = [],
            failedScenarios = [],
            failedSteps = [],
            currentFeature,
            currentScenario,
            currentStep;

        if (!reports[0]) return summaryResult;

        reports.forEach(function (feature) {
            currentFeature = feature;
            feature.elements.forEach(function (scenario) {
                currentScenario = scenario;
                failedSteps = [];
                scenario.steps.forEach(function (step) {
                    currentStep = step;
                    if (step.result && step.result.status !== 'passed') {
                        failedSteps.push(currentStep);
                    }
                });
                if (failedSteps.length) {
                    failedScenarios.push(currentScenario);
                }
            });
            if (failedScenarios.length) {
                failedFeatures.push(currentFeature);
            }
        });
        if (failedFeatures.length === 0) {
            summaryResult = 'passed';
        } else {
            summaryResult = 'failed';
        }
        return {
            summary : summaryResult,
            failedFeatures : failedFeatures,
            failedScenarios : failedScenarios
        };
    };
    self.getReport = function () {
        return {
            getFeature : function (featureName) {
                var result = null
                testReports.forEach(function (feature) {
                    if (featureName === feature.name) {
                        result = feature;
                        result.getSummary = function (){
                            return generateReport([result]).summary;
                        };
                        return result;
                    }
                });

                return result;
            },
            getSummary : function () {
                return generateReport(testReports).summary || 'pending';
            },
            getFailedFeatures : function () {
                return generateReport(testReports).failedFeatures;
            },
            getFailedScenarios : function () {
                return generateReport(testReports).failedScenarios;
            },
            reports : testReports
        };
    };

    self.addReport = function (report) {
        if (report) {
            testReports.push(report);
        }
    }

};