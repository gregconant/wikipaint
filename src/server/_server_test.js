"use strict";

var PORT = "8080";

var server = require("./server.js");
var http = require("http");


exports.tearDown = function (done) {
    console.log("tear down start");
    server.stop(function () {
        done();
    });
    console.log("tear down end");
};

// test redundant given the ReturnsHelloWorld test below
//exports.test_serverRespondsToGetRequests = function (test) {
//    server.start();
//    http.get("http://localhost:8080", function (response) {
//        test.done();
//    });
//};

exports.test_serverReturnsHelloWorldOnGivenPort = function (test) {
    server.start(8080);
    var request = http.get("http://localhost:8080");
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

            test.done();
        });
    });
};
