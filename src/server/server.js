"use strict";

var http = require("http");
var server;


exports.start = function () {
    server = http.createServer();

    server.on("request", function (request, response) {
        console.log("Received request");
        var body = "<html><head><title>Node HTTP Test</title><body><p>This is a basic response for node's HTTP server.</p>" +
            "</body></html>";

        response.end(body);
    });

    server.listen(8080); // TODO: remove duplication of port #
};

exports.stop = function (callback) {
    server.close(callback);
};