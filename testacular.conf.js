// Testacular configuration
// Generated on Mon Oct 01 2012 07:23:39 GMT-0400 (Eastern Daylight Time)


// base path, that will be used to resolve files and exclude
basePath = '.';


// list of files / patterns to load in the browser
files = [
    MOCHA,
    MOCHA_ADAPTER,
    "node_modules/expect/expect.js",
    "src/client/_*_test.js"
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: dots || progress
reporter = 'progress';


// web server port
port = 8082;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = [];


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
