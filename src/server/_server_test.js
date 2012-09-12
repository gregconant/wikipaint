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

// TODO: handle case where stop() is called before start()
// TODO: test-drive stop() callback

exports.testServerRespondsToGetRequests = function (test) {
    server.start();
    http.get("http://localhost:8080", function (response) {
        test.done();
    });
};
