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
        fs.readFile(htmlFileToServe, function (err, data) {
            if (err) {  // TODO: fix me
                throw err;
            }
            response.end(data);
        });
    });
    server.listen(portNumber);
};

exports.stop = function (callback) {
    server.close(callback);
};