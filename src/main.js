/* global require */

require([], function() {
  "use strict";

  require.config({
                  baseUrl: "../../client",
                  paths: {
                    //'raphael-core' : '../../../vendor_client/raphael/raphael.core',
                    "eve": "../../../vendor_client/raphael/eve",
                    'raphael' : '../../../vendor_client/raphael/raphael.amd',
                    'raphael-core' : '../../../vendor_client/raphael-2.1.2',
                    'raphael-svg' : '../../../vendor_client/raphael/raphael.svg',
                    'raphael-vml' : '../../../vendor_client/raphael/raphael.vml',
                    "jquery": "../../vendor_client/jquery-1.8.3"
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
