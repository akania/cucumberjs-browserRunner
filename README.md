
#Cucumber.js Browser Runner

Browser runner for [cucumber.js  library](https://github.com/cucumber/cucumber-js)
This runner is a wrapper around [cucumber.js](https://github.com/cucumber/cucumber-js) library which is responsible for running
a tests written in [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin)

### [Demo page](http://akania.github.io/cucumberjs-browserRunner/)

### Features

- load feature files
- load step definition for every feature file automatically
- execute tests using cucumber-js library
- report missing feature files and missing world, step & background definition files ( console )
- build-in reporters ( HTML , console )
- build-in api to generate reports
- step definitions are binded to the scope of a single feature
- supports [tags](https://github.com/cucumber/cucumber-tck/blob/master/tags.feature) 
- supports [background steps](https://github.com/cucumber/cucumber/wiki/Background) 
- supports [scenario outlines](https://github.com/cucumber/cucumber/wiki/Scenario-Outlines) 
- supports [data tables](https://github.com/cucumber/cucumber-tck/blob/master/data_tables.feature)
- supports [hooks](https://github.com/cucumber/cucumber-tck/blob/master/hooks.feature)
- supports [world](https://github.com/cucumber/cucumber-tck/blob/master/world.feature)
- runner is able to run one/multiple features
- runner supports (configurable) timeouts after which step will automatically fail [issue](https://github.com/cucumber/cucumber-js/pull/192)
- runner supports tags in scenario outlines [issue](https://github.com/cucumber/cucumber-js/pull/197)

#### Runner HTML UI
- list all features, scenarios, steps, tags, data tables and more...
- allow to run selected features, scenarios based on name or tag
- summary generated during test

### TODO
- ... 

### How to use

* Specify features in /features directory ( /features/*.feature )
* For every feature specify step definition in features/step_definitions directory ( /features/step_definitions/*_steps.js )

Please clone this repo - main page contains example


### Issues / Questions ...

Please use GitHub Issue tracker
Google groups : [cukes](https://groups.google.com/forum/#!forum/cukes)