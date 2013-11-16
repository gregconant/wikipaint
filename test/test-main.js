var tests = [];

for (var file in window.__karma__.files) {

  if (/_spec\.js$/.test(file)) {
    console.log("found test in " + file);
    tests.push(file);
  }
}

requirejs.config({
                   // Karma serves files from '/base'
                   baseUrl: '/base',

                   paths: {
                     "client": "src/client/client",
                     "jquery": "vendor_client/jquery-1.8.3",
                     //"server": "src/server/server",
                     "eve": "vendor_client/raphael/eve",
                     'raphael' : 'vendor_client/raphael/raphael.amd',
                     'raphael-core' : 'vendor_client/raphael-2.1.2',
                     'raphael-svg' : 'vendor_client/raphael/raphael.svg',
                     'raphael-vml' : 'vendor_client/raphael/raphael.vml'
//                     "raphael" : 'vendor_client/raphael-2.1.0-min.js',
                   },

                   shim: {
                     'eve' : {
                       exports: 'eve'
                     },
                     'raphael' : {
                       exports: 'Raphael'
                     }
                   },

                   // ask Require.js to load these files (all our tests)
                   deps: tests,

                   // start test run, once Require.js is done
                   callback: window.__karma__.start
                 });
