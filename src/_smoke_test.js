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
        PORT_NUM = "5000",
        fs = require("fs"),
        child,
        procfile = require("procfile");

//    exports.setUp = function (done) {
//        runServer(done);
//    };

    exports.setUp = function (done) {
        runServer(done);
    };

    exports.tearDown = function (done) {
        if (!child) {
            return;
        } else {
            child.on("exit", function (code, signal) {
                done();
            });
            child.kill();
        }
    };

    // TODO: factor out common server name
    exports.test_canGetHomePage = function (test) {
        httpGet("http://localhost:" + PORT_NUM, function (response, receivedData) {
            console.log("got home page!");
            var foundHomePage = (receivedData.indexOf("Welcome to WikiPaint!") !== -1);
            test.ok(foundHomePage, "home page should have contained 'Welcome to WikiPaint!'.");
            test.done();
        });
    };

    exports.test_canGet404Page = function (test) {
        httpGet("http://localhost:" + PORT_NUM + "/somepage", function (response, receivedData) {
            console.log("got 404 page!");
            var foundHomePage = (receivedData.indexOf("404") !== -1);
            test.ok(foundHomePage, "404 page should have contained '404'.");
            test.done();
        });
    };

    function runServer(doneCallback) {
        var commandLine = parseProcFile();
//        console.log("command line: " + commandLine);
//        console.log("command line[0]: " + commandLine[0]);
//        console.log("command line[1]: " + commandLine[1]);
//        console.log("command line[2]: " + commandLine[2]);

        console.log("starting process");
        child = child_process.spawn(commandLine.command, commandLine.options);

        console.log("started process");
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started") {
                doneCallback();
            }
        });
    }

    function parseProcFile() {

        var fileData = fs.readFileSync("Procfile", "utf8"),
            webCommand = procfile.parse(fileData).web;

        webCommand.options = webCommand.options.map(function (element) {
            if (element === "$PORT") {
                return "5000";
            } else {
                return element;
            }
        });
//        console.log(webCommand);
        return webCommand;
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