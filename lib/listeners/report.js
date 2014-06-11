CucumberJsBrowserRunner.ReportGenerator = function() {
    
    var testReports = [],
        self = this;
    

    function generateReport(reports) {
        var summaryResult = 'pending',
            failedFeatures = [],
            currentFeature,
            currentScenario,
            currentStep;

        if (!reports[0]) return summaryResult;

        reports.forEach(function (feature) {
            currentFeature = feature;
            if (feature.status === 'failed') {
                summaryResult = 'failed';
                return;
            }
            feature.elements.forEach(function (scenario) {
                currentScenario = scenario;
                scenario.steps.forEach(function (step) {
                    currentStep = step;
                    if (step.result.status !== 'passed') {
                        failedFeatures.push(currentFeature);
                    }
                });
            });
        });
        if (failedFeatures.length === 0) {
            summaryResult = 'passed';
        } else {
            summaryResult = 'failed';
        }
        return {
            summary : summaryResult,
            failedFeatures : failedFeatures
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
            getFailed : function () {
                return generateReport(testReports).failedFeatures;
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