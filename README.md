
#Cucumber.js Browser Runner

Attempt to create a browser runner for [cucumber.js](https://github.com/cucumber/cucumber-js)
This is only wrapper around [cucumber.js](https://github.com/cucumber/cucumber-js) library which is responsible for running
a tests written in [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin)

### Features

- runner is able to load feature files
- runner is able to load step definition for every feature file automatically
- runner is able execute tests using cucumber-js library
- runner is able to report missing feature files and missing step definition files ( only console )
- runner provides build-in reporters ( HTML , console ) so developer can get visual feedback after the test run
- runner provides build-in api to generate report so developer can use an api to get feedback
- step definitions are binded to the scope of a single feature
- runner supports [tags](https://github.com/cucumber/cucumber-tck/blob/master/tags.feature) 
- runner is able to run one/multiple features
- runner supports (configurable) timeouts after which step will automatically fail

#### New UI
- list all features, scenarios, steps, tags, data tables and more... WIP
- allow to run selected features, scenarios based on name or tag

### TODO
- step definitions can be reused by multiple features
- expose api for using different kind of formatters ( JSON, Summary, Pretty...)
- better visual feedback WIP
- ... 

### How to use

* Specify features in /features directory ( /features/*.feature )
* For every feature specify step definition in features/step_definitions directory ( /features/step_definitions/*_steps.js )

Example : /features/test.feature
``` gherkin
Feature : test feature
    In order to run a feature
    As a developer
    I need to create feature file with scenarios

    Scenario: test scenario
        Given test scenario
        When i load it
        Then i can run tests
```

Example : /features/step_definitions/test_steps.js
``` javascript
CucumberJsBrowserRunnerStepDefinitions.test(function () {
  var And = Given = When = Then = this.defineStep;

  Given(/^test scenario$/, function(callback) {
      callback();
  });

  When(/^i load it$/, function(callback) {
      callback();
  });

  Then(/^i can run tests$/, function(callback) {
      callback;
  });
});
```

Create a page with following code
``` html
<html>
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <title>Cucumber.js browser runner</title>
      <link href="runner.css" rel="stylesheet" type="text/css"/>
      <script type="text/javascript" src="/cucumber.js"></script>
      <script type="text/javascript" src="vendor/jquery-1.9.1.min.js"></script>
      <script type="text/javascript" src="/runner.js"></script>
    </head>
    <body>

      <h2>Cucumber JS Browser Runner</h2>
            <div id="output" class="cucumber-report"></div>
            <div id="errors-container">
            <h3>Errors</h3>
            <pre id="errors"></pre>
        </div>
      <script>
        var runner = new CucumberJsBrowserRunner();
        runner.loadFeatures(['test'], function () {
            globalRunner.run({
                callback : function () {
                    console.log('summary', globalRunner.getReport().getSummary());
                }
            });
            console.log('loaded', globalRunner.getReport().getSummary());
        });
        .....
```


### Issues / Questions ...

Please use GitHub Issue tracker
Google groups : [cukes](https://groups.google.com/forum/#!forum/cukes)