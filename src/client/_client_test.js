(function () {
    "use strict";

    var PORT = "5020",
        http = require("http"),
        fs = require("fs"),
        assert = require("assert"),
        TEST_HOME_PAGE = "generated/test/home.html",
        TEST_404_PAGE = "generated/test/404.html";


    function httpGet(url, callback) {
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT, function () {
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
        });
    }

    function cleanUpFile(fileName) {
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
            assert.ok(!fs.existsSync(fileName), "could not delete test file: [" + fileName + "]");
        }
    }


}());