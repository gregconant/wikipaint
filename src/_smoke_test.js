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
        httpGet("http://localhost:" + PORT_NUM, function (response, receivedData) {
            var foundHomePage = (receivedData.indexOf("Welcome to WikiPaint!") !== -1);
            test.ok(foundHomePage, "home page should have contained 'Welcome to WikiPaint!'.");
            test.done();
        });
    };

    exports.test_canGet404Page = function (test) {
        httpGet("http://localhost:" + PORT_NUM + "/somepage", function (response, receivedData) {
            var foundHomePage = (receivedData.indexOf("404") !== -1);
            test.ok(foundHomePage, "404 page should have contained '404'.");
            test.done();
        });
    };

    function runServer(doneCallback) {
        child = child_process.spawn("node", ["src/server/wikipaint", PORT_NUM]);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started") {
                doneCallback();
            }

        });
    }

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