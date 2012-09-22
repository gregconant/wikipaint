/**
 * Created with JetBrains WebStorm.
 * User: grewgsmash
 * Date: 9/22/12
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */

// launch the server in the same way it happens in production
// get a page
// confirm we got something

(function () {
    "use strict";

    var child_process = require("child_process"),
        http = require("http"),
        server = require("./server/server.js"),
        jake = require("jake");

    exports.test_for_smoke = function (test) {

        var nodeArgs = ["src/server/wikipaint 8081"];

        runServer(nodeArgs);
        setTimeout(function () {
            console.log("ran server");
            httpGet("http://localhost:8080", function (response, receivedData) {
                console.log("got file");
                test.done();
            });
        }, 1000);
    };

    function runServer(nodeArgs) {
        var process = child_process.spawn("node", nodeArgs);

        process.stdout.on("data", function (chunk) {
            console.log("server stdout: " + chunk);
        });
        process.stderr.on("data", function (chunk) {
            console.log("server stderr: " + chunk);
        });
        process.on("exit", function (code, signal) {
            console.log("server process exited with code [" + code + "] and signal [" + signal + "]");
        });
//        process.run();
    }

    // TODO: eliminate duplication with same function in _server_test.js
    function httpGet(url, callback) {

        var request = http.get(url);
        request.on("response", function (response) {
            var receivedData = "";
            response.setEncoding("utf8");

            response.on("data", function (chunk) {
                receivedData += chunk;
            });
            response.on("end", function () {
                server.stop(function () {
                    callback(response, receivedData);
                });
            });
        });
    }
}());