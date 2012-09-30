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
        child;

//    exports.setUp = function (done) {
//        runServer(done);
//    };

    exports.setUp = function (done) {
        runServer(done);
    };

    exports.tearDown = function (done) {
        if (!child) {
            console.log("Child is null");
            return;
        } else {
            console.log("Child is NOT null");
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
        //child = child_process.spawn(commandLine[0], commandLine[1], commandLine[2]);
        child = child_process.spawn("node", ["src/server/wikipaint.js", PORT_NUM]);
        console.log("started process");
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (chunk) {
            if (chunk.trim() === "Server started") {
                doneCallback();
            }

        });

    }

    function parseProcFile() {
        var procFile = fs.readFileSync("Procfile", "UTF8"),
            matches = "",
            commandLine,
            args;

        console.log(procFile);
        //matches = procFile.match(/^web:(\S)?(\S+\s+)?/); // matches 'web: one two three'
        matches = procFile.trim().match(/^web:(\S*)([\S*\s*]*)/);

        if (!matches) {
            console.log("No matches");
            throw "Could not parse procfile";
        }

        commandLine = matches[1];
        console.log("commandLine:" + commandLine);

        args = commandLine.split(" ");
        console.log("split: " + args);
        args = args.filter(function (element) {
            return element.trim() !== "";
        });
        console.log("split: " + args);
        //return ["node", "src/server/wikipaint.js", "8081"];
        return parsedCommandLine;
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