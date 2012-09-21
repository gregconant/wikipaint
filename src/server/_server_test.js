(function () {
    "use strict";

    var PORT = "8081",
        server = require("./server.js"),
        http = require("http"),
        fs = require("fs"),
        assert = require("assert"),
        TEST_FILE = "generated/test/test.html";

    exports.tearDown = function (done) {
        if (fs.existsSync(TEST_FILE)) {
            fs.unlinkSync(TEST_FILE);
            assert.ok(!fs.existsSync(TEST_FILE), "could not delete test file: [" + TEST_FILE + "]");
        }
        done();
    };

    exports.test_servesHomePageFromFile = function (test) {
        var testDir = "generated/test",
            expectedData = "This is served from a file";

        fs.writeFileSync(TEST_FILE, expectedData);
        httpGet("http://localhost:" + PORT, function (response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.equals(expectedData, responseData, "response text");
            test.done();
        });
    };

    exports.test_returns404ForEverythingExceptHomePage = function (test) {
        httpGet("http://localhost:" + PORT + "/bargle", function (response, responseData) {
            test.equals(404, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_returnsHomePageWhenAskedForIndex = function (test) {
        var testDir = "generated/test";

        fs.writeFileSync(TEST_FILE, "some text");
        httpGet("http://localhost:" + PORT + "/index.html", function(response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_requiresFileParameter = function (test) {
        test.throws(function () {
            server.start();
        });
        test.done();
    };

    exports.test_requiresPortNumberParameter = function (test) {
        test.throws(function () {
            server.start(TEST_FILE);
        });
        test.done();
    };

    exports.test_runsCallbackWhenStopCompletes = function (test) {
        server.start(TEST_FILE, PORT);
        server.stop(function () {
            test.done();    // this proves that the callback is being called, because the test is ending.
        });
    };
    //
    exports.test_stopThrowsException_WhenServerIsntRunning = function (test) {
        test.throws(function () {
            server.stop();
        });
        test.done();
    };


    function httpGet(url, callback) {
        server.start(TEST_FILE, PORT);
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