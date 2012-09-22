"use strict";

var http = require("http"),
    fs = require("fs"),
    server,
    serveFile;


exports.start = function (homePageToServe, notFoundPageToServe, portNumber) {
    if (!portNumber) {
        throw "port number is required";
    }
    server = http.createServer();
    server.on("request", function (request, response) {
        if (request.url === "/" || request.url === "/index.html") {
            console.log("got request for " + request.url);
            response.statusCode = 200;
            serveFile(response, homePageToServe);

            console.log("done serving request");

        } else {
            response.statusCode = 404;
            serveFile(response, notFoundPageToServe);
            console.log("done serving 404");
        }
    });
    server.listen(portNumber);
};

exports.stop = function (callback) {
    server.close(callback);
};

serveFile = function (response, file) {
    fs.readFile(file, function (err, data) {
        if (err) {  // TODO: fix me
            console.log("error encountered reading file " + file);
            throw err;
        }
        response.end(data);
    });
};