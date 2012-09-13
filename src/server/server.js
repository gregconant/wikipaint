"use strict";

var http = require("http");
var server;


exports.start = function (portNumber) {
    server = http.createServer();
    server.on("request", function (request, response) {
        var responseText = "Hello World";

        response.end(responseText);
        //response.end();
    });
    server.listen(portNumber);
};

exports.stop = function (callback) {
    server.close(callback);
};