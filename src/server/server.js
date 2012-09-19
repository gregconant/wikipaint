"use strict";

var http = require("http"),
    fs = require("fs"),
    server;


exports.start = function (htmlFileToServe, portNumber) {
    if (!portNumber) {
        throw "port number is required";
    }
    server = http.createServer();
    server.on("request", function (request, response) {
        if (request.url === "/") {
            fs.readFile(htmlFileToServe, function (err, data) {
                if (err) {  // TODO: fix me
                    throw err;
                }
                response.end(data);
            });
        } else {
            response.statusCode = 404;
            response.end();
        }
    });
    server.listen(portNumber);
};

exports.stop = function (callback) {
    server.close(callback);
};