/**
 * Created with JetBrains WebStorm.
 * User: grewgsmash
 * Date: 9/22/12
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */

// launch the server in the same way it happens in production
// get a page
// confirm we got something

(function () {
    "use strict";

    exports.test_for_smoke = function (test) {
        test.ok(false, "hi");
        test.done();
    };

    function httpGet(url, callback) {
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT);
        var request = http.get(url);
        request.on("response", function (response) {
            var receivedData = "";
            response.setEncoding("utf8");

            response.on("data", function (chunk) {
                receivedData += chunk;
            });
            response.on("end", function () {
                server.stop(function () {
                    callback(response, receivedData);
                });
            });
        });
    }

}());