(function () {
    "use strict";

    var PORT = "8080",
        server = require("./server.js"),
        http = require("http"),
        fs = require("fs"),
        assert = require("assert"),
        TEST_FILE = "generated/test/test.html";


    function httpGet(url, callback) {
        server.start(TEST_FILE, 8080);
        var request = http.get(url);
        request.on("response", function(response) {
            var receivedData = "";
            response.setEncoding("utf8");

            response.on("data", function(chunk) {
                receivedData += chunk;
            });
            response.on("end", function() {
                server.stop(function() {
                    callback(response, receivedData);
                });
            });
        });
    }

    exports.tearDown = function (done) {
        if (fs.existsSync(TEST_FILE)) {
            fs.unlinkSync(TEST_FILE);
            assert.ok(!fs.existsSync(TEST_FILE), "could not delete test file: [" + TEST_FILE + "]");
        }
        done();
    };
    exports.test_serverServesHomePageFromFile = function(test) {
        var testDir = "generated/test";
        var testData = "This is served from a file";

        fs.writeFileSync(TEST_FILE, testData);
        httpGet("http://localhost:8080", function(response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.equals(testData, responseData, "response text");
            test.done();
        });
    };

    exports.test_serverReturns404ForEverythingExceptHomePage = function (test) {
        httpGet("http://localhost:8080/bargle", function(response, responseData) {
            test.equals(404, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_serverReturnsHomePageWhenAskedForIndex = function (test) {
        var testDir = "generated/test";
        var testData = "This is served from a file";

        fs.writeFileSync(TEST_FILE, testData);
        httpGet("http://localhost:8080/index.html", function(response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_serverRequiresFileToServe = function (test) {
        test.throws(function () {
            server.start();
        });
        test.done();
    };

    exports.test_serverRequiresPortNumber = function (test) {
        test.throws(function () {
            server.start(TEST_FILE);
        });
        test.done();
    };

    exports.test_serverRunsCallbackWhenStopCompletes = function (test) {
        server.start(TEST_FILE, PORT);
        server.stop(function () {
            test.done();    // this proves that the callback is being called, because the test is ending.
        });
    };
    //
    exports.test_stopCalledWhenServerIsntRunning_ThrowsException = function (test) {
        test.throws(function () {
            server.stop();
        });
        test.done();
    };

}());