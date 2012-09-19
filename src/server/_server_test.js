"use strict";

var PORT = "8081";

var server = require("./server.js"),
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

// TODO: move file cleanup to "teardown" method
exports.test_serverServesAFile = function (test) {
    var testDir = "generated/test",
        testData = "This is served from a file",
        request;

    fs.writeFileSync(TEST_FILE, testData);

    server.start(TEST_FILE, PORT);
    request = http.get("http://localhost:" + PORT);
    request.on("response", function (response) {
        var receivedData = false;
        response.setEncoding("utf8");

        test.equals(200, response.statusCode, "status code");
        response.on("data", function (chunk) {
            receivedData = true;
            test.equals(testData, chunk, "response text");

        });
        response.on("end", function () {
            test.ok(receivedData, "should have received response data");
            server.stop(function () {
                test.done();
            });

        });
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

