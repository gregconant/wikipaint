/*global desc, task, jake, fail, complete */
(function () {
    "use strict";

    function sh(command, onCommandEnd) {
        var stdout = "",
            process;

        console.log(">" + command);

        process = jake.createExec(command, { printStdout: true, printStderr: true });

        process.on("stdout", function (chunk) {
            stdout += chunk;
        });
        process.on("cmdEnd", function () {
            // remove whitespace from end of string returned so comparison will work
            onCommandEnd(stdout);
        });
        process.run();
    }

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
        var NODE_VERSION = "v0.8.9",
            command = "node --version";

        sh(command, function (stdout) {
            if (stdout.trim() !== NODE_VERSION) {
                fail("Incorrect Node version. Expected '" + NODE_VERSION + "', got '" + stdout + "'");
            }
            complete();
        });
    }, { async: true});




}());