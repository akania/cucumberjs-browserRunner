cucumberjs-browserRunner
========================

Attempt to create a browser runner for cucumber-js.

DONE :
- runner is able to load feature files
- runner is able to load step definition for every feature file automatically
- runner is able execute tests using cucumber-js library
- runner provides build-in reporters ( HTML , console ) so developer can get visual feedback after the test run
- runner provides build-in report generator so developer can use an api to get feedback after the test run
- step definitions ( code ) are binded to the scope of the feature

TODO :
- step definitions ( code ) can be reused by multiple features
- expose api for using different kind of formatters ( JSON, Summary, Pretty...)
