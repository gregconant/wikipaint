// Karma configuration
// Generated on Sat Nov 09 2013 15:17:12 GMT-0500 (Eastern Standard Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    plugins: [ 'karma-mocha', 'karma-chrome-launcher', 'karma-firefox-launcher', 'karma-requirejs', 'karma-chai' ],

    // frameworks to use
    frameworks: ['mocha', 'requirejs', 'chai' ],

    // list of files / patterns to load in the browser
    files: [
      'test/test-main.js',
      {pattern: 'src/client/client*.js', included: false},
      {pattern: 'test/_client_*_spec.js', included: false}
      //{pattern: './vendor_client/jquery-1.8.3.js', included: true },
      //{pattern: './vendor_client/raphael-2.1.0-min.js', included: false },
//      'src/server/content/homepage.html',

    ],

    // list of files to exclude
    exclude: [
      'src/main.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 8082,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};
