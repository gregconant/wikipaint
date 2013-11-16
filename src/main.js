/* global require */

require([], function() {
  "use strict";

  require.config({
                  baseUrl: "../",
                  paths: {
                    "jquery": "vendor_client/jquery",
                    "eve": "vendor_client/raphael/eve",
                    'raphael-core' : 'vendor_client/raphael/raphael.core',
                    //'raphael-core' : '../../../vendor_client/raphael/raphael.core',
                    'raphael-svg' : 'vendor_client/raphael/raphael.svg',
                    'raphael-vml' : 'vendor_client/raphael/raphael.vml',
                    'raphael' : 'vendor_client/raphael/raphael.amd'

                  },
                  shim: {
                    'eve': {
                      exports: "eve"
                    },
                    'raphael': {
                      deps: ["eve", "jquery"],
                      exports: "raphael"
                    }
                  },
                  waitSeconds: 15
                 });
});
