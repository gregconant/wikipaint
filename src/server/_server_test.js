"use strict";

var PORT = "8081";

var server = require("./server.js");
var http = require("http");
var fs = require("fs");

//exports.setUp = function (done) {
//    server.start(8080);
//    done();
//};

//exports.tearDown = function (done) {
//    console.log("tear down start");
//    server.stop(function () {
//        done();
//    });
//    console.log("tear down end");
//};

// test redundant given the ReturnsHelloWorld test below
//exports.test_serverRespondsToGetRequests = function (test) {
//    server.start();
//    http.get("http://localhost:8080", function (response) {
//        test.done();
//    });
//};

exports.test_serverReturnsHelloWorldOnGivenPort = function (test) {
    server.start(PORT);
    var request = http.get("http://localhost:" + PORT);
    request.on("response", function (response) {
        var receivedData = false;
        response.setEncoding("utf8");
        test.equals(200, response.statusCode, "status code");
        response.on("data", function (chunk) {
            test.equals("Hello World", chunk, "response text");
            console.log("got data!");
            receivedData = true;
        });
        response.on("end", function () {
            test.ok(receivedData, "should have received response data");
            server.stop(function () {
                test.done();
            });

        });
    });
};

exports.test_serverRequiresPortNumber = function (test) {
    test.throws(function () {
        server.start();
    });
    test.done();
};

exports.test_serverRunsCallbackWhenStopCompletes = function (test) {
    server.start(PORT);
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

exports.test_serverServesAFile = function (test) {
    var testDir = "generated/test";
    var testFile = testDir + "/test.html";
    fs.writeFileSync(testFile, "Hello World");
    test.done();
};