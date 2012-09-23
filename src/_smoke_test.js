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
        jake = require("jake"),
        PORT_NUM = "8081",
        child;

    exports.tearDown = function (done) {
        child.on("exit", function (code, signal) {
            console.log("Exit received");
            done();
        });
        console.log("before kill()");
        child.kill();
        console.log("after kill()");
    };

    exports.test_for_smoke = function (test) {
        var nodeArgs = ["src/server/wikipaint", PORT_NUM];
        runServer(nodeArgs, function () {
            console.log("callback executed");
            httpGet("http://localhost:" + PORT_NUM, function (response, receivedData) {
                console.log("in response end callback; got file");
                test.done();
            });
        });
    };

    function runServer(nodeArgs, doneCallback) {
        var child = child_process.spawn("node", nodeArgs);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (chunk) {
            process.stdout.write("server stdout: " + chunk);
            if (chunk.trim() === "Server started") {
                doneCallback();
            }
        });

        child.stderr.on("data", function (chunk) {
            process.stdout.write("server stderr: " + chunk);
        });
        child.on("exit", function (code, signal) {
            process.stdout.write("server process exited with code [" + code + "] and signal [" + signal + "]");
        });
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
                console.log("response ended, stopping server now...");
                server.stop(function () {
                    console.log("stopping server");
                    callback(response, receivedData);
                });
            });
        });
    }
}());