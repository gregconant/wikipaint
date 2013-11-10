/* global require */

require([], function() {
  "use strict";

  require.config({
                  baseUrl: "../../client",
                  paths: {
                    "eve": "../../vendor_client/raphael/eve",
                    'raphael-core' : '../../vendor_client/raphael/raphael.core',
                    'raphael-svg' : '../../vendor_client/raphael/raphael.svg',
                    'raphael-vml' : '../../vendor_client/raphael/raphael.vml',
                    'raphael' : '../../vendor_client/raphael/raphael.amd',
                    "jquery": "../../vendor_client/jquery-1.8.3"
                  },
                  shim: {
                    'eve': {
                      exports: "eve"
                    },
                    'raphael': {
                      deps: ["eve"],
                      exports: "Raphael"
                    }
                  },
                  waitSeconds: 15
                 });
});
