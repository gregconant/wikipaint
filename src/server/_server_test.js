"use strict";

var server = require("./server.js");
var http = require("http");


exports.tearDown = function (test) {
    console.log("tear down start");
    server.stop(function () {
        console.log("stop callback");
    });
    console.log("tear down end");
};

// TODO: handle case where stop() is called before start()
// TODO: test-drive stop() callback

exports.testHttpServer = function (test) {
    server.start();

    http.get("http://localhost:8080", function (response) {
        console.log("response callback");
        test.done();
    });
    console.log("get called");

    console.log("done called");
};
