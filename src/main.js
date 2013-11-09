/* global require */

require([], function() {
  "use strict";

  require.config({
                  baseUrl: "../../client",
                  paths: {
                     "raphael": "../../vendor_client/raphael-2.1.0-min"
                  },
                  waitSeconds: 15
                 });
});
