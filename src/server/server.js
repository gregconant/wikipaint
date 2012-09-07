"use strict";

var http = require("http");
var myServer;

exports.start = function () {
    var server = http.createServer();

    myServer = server;
    server.on("request", function (request, response) {
        console.log("Received request");
        var body = "<html><head><title>Node HTTP Test</title><body><p>This is a basic response for node's HTTP server.</p>" +
            "</body></html>";

        response.end(body);
    });

    server.listen(8080); // TODO: remove duplication of port #
};
