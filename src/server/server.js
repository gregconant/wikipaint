(function () {
    "use strict";

    var http = require("http"),
        fs = require("fs"),
        server;

    exports.start = function (homePageToServe, notFoundPageToServe, portNumber, callback) {
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
        server.listen(portNumber, callback);
    };

    exports.stop = function (callback) {
        //console.log("server stopping");
        server.close(callback);
    };

    function serveFile(response, file) {
        fs.readFile(file, function (err, data) {
            if (err) {  // TODO: fix me
                console.log("error encountered reading file " + file);
                throw err;
            }
            response.end(data);
        });
    }
}());