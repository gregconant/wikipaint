"use strict";

var http = require("http");
var server;


exports.start = function () {
    server = http.createServer();
    server.on("request", function (request, response) {
        var responseText = "Hello World";

        response.end(responseText);
        //response.end();
    });
    server.listen(8080);
};

exports.stop = function (callback) {
    server.close(callback);
};