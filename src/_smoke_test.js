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

    var jake = require("jake"),
        child_process = require("child_process"),
        http = require("http"),
        PORT_NUM = "8081",
        child;

//    exports.setUp = function (done) {
//        runServer(done);
//    };

    exports.setUp = function(done) {
        runServer(done);
    };

    exports.tearDown = function (done) {
        child.on("exit", function (code, signal) {
            done();
        });
        child.kill();
    };

    exports._test_canGetHomePage = function (test) {
        console.log("calling RunServer");
        httpGet("http://localhost:" + PORT_NUM, function (response, receivedData) {
            var foundHomePage = (receivedData.indexOf("wikipaint home page") !== -1);
            test.ok(foundHomePage, "home page should have contained 'wikipaint home page'.");
            test.done();
        });
    };

    // TODO: check 404 page

    function runServer(doneCallback) {
        child = child_process.spawn("node", ["src/server/wikipaint", PORT_NUM]);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started") {
                doneCallback();
            }

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
                callback(response, receivedData);
            });
        });
    }
}());