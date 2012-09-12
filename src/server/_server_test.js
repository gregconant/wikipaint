"use strict";

var server = require("./server.js");
var http = require("http");


exports.tearDown = function (done) {
    console.log("tear down start");
    server.stop(function () {
        done();
    });
    console.log("tear down end");
};

exports.testServerRespondsToGetRequests = function (test) {
    server.start();
    http.get("http://localhost:8080", function (response) {
        test.done();
    });
};
