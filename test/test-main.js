var tests = [];

for (var file in window.__karma__.files) {

  if (/_spec\.js$/.test(file)) {
    console.log("found test in " + file);
    tests.push(file);
  }
}

requirejs.config({
                   // Karma serves files from '/base'
                   baseUrl: '/base/src',

                   paths: {
                     raphael: 'vendor_client/raphael-2.1.0-min',
                     'jquery': 'vendor_client/jquery-1.8.3'
                   },

                   shim: {
                     'underscore': {
                       exports: '_'
                     }
                   },

                   // ask Require.js to load these files (all our tests)
                   deps: tests,

                   // start test run, once Require.js is done
                   callback: window.__karma__.start
                 });