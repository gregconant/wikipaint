/*global desc, task, jake, fail, complete */
(function () {
    "use strict";

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", ["node"], function () {
        var lint = require("./build/lint/lint_runner.js"),
            files = new jake.FileList(),
            options = nodeLintOptions();

        files.include("**/*.js");
        files.exclude("node_modules");

        lint.validateFileList(files.toArray(), options, {});
    });


    desc("Test everything");
    task("test", ["node"], function () {

        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['src/server/_server_test.js'], null, function (failures) {
            if (failures) {
                fail("Tests failed");
            }
            complete();
        }
            );
    }, {async: true});

    desc("Integrate");
    task("integrate", ["default"], function () {
        console.log("1. these are the steps to integrate");
    });

    desc("Ensure correct version of Node is present");
    task("node", [], function () {
        var command = "node --version",
            desiredNodeVersion = "v0.8.9",
            stdout = "",
            process;
        console.log(">" + command);

        stdout = "";
        process = jake.createExec(command, { printStdout: true, printStderr: true });

        process.on("stdout", function (chunk) {
            stdout += chunk;
        });
        process.on("cmdEnd", function () {
            // remove whitespace from end of string returned so comparison will work
            stdout = stdout.trim();
            console.log("Got Node version: " + stdout);
            if (stdout !== desiredNodeVersion) {
                fail("Incorrect Node version. Expected '" + desiredNodeVersion + "', got '" + stdout + "'");
            }

            complete();
        });
        process.run();
    }, { async: true});

    function nodeLintOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            node: true
        };
    }
}());