(function () {
    "use strict";

    var PORT = "8081",
        server = require("./server.js"),
        http = require("http"),
        fs = require("fs"),
        assert = require("assert"),
        TEST_HOME_PAGE = "generated/test/home.html",
        TEST_404_PAGE = "generated/test/404.html";

    exports.tearDown = function (done) {
        cleanUpFile(TEST_HOME_PAGE);
        cleanUpFile(TEST_404_PAGE);
        done();
    };

    exports.test_servesHomePageFromFile = function (test) {
        var expectedData = "This is a home page";
        fs.writeFileSync(TEST_HOME_PAGE, expectedData);

        httpGet("http://localhost:" + PORT, function (response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.equals(expectedData, responseData, "response text");
            test.done();
        });
    };

    exports.test_returns404FromFileForEverythingExceptHomePage = function (test) {
        var expectedData = "This is a 404 page";
        fs.writeFileSync(TEST_404_PAGE, expectedData);

        httpGet("http://localhost:" + PORT + "/bargle", function (response, responseData) {
            test.equals(404, response.statusCode, "status code");
            test.equals(expectedData, responseData, "404 text");
            test.done();
        });
    };

    exports.test_returnsHomePageWhenAskedForIndex = function (test) {
        fs.writeFileSync(TEST_HOME_PAGE, "test test");

        httpGet("http://localhost:" + PORT + "/index.html", function (response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_requiresHomePageParameter = function (test) {
        test.throws(function () {
            server.start();
        });
        test.done();
    };
    exports.test_requires404PageParameter = function (test) {
        test.throws(function () {
            server.start(TEST_HOME_PAGE);
        });
        test.done();
    };

    exports.test_requiresPortParameter = function (test) {
        test.throws(function () {
            server.start(TEST_HOME_PAGE, TEST_404_PAGE);
        });
        test.done();
    };

    exports.test_runsCallbackWhenStopCompletes = function (test) {
        server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT);
        server.stop(function () {
            test.done();    // this proves that the callback is being called, because the test is ending.
        });
    };
    //
    exports.test_stopThrowsException_WhenNotRunning = function (test) {
        test.throws(function () {
            server.stop();
        });
        test.done();
    };


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