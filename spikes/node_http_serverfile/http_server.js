"use strict";

var http = require("http");

var server = http.createServer();
var fs = require("fs");

server.on("request", function (request, response) {
    console.log("Received request");
    fs.readFile("file.html", function (err, data) {
        if (err) {
            throw err;
        }
        response.end(data);
    });
});

server.listen(8080);

console.log("server started");