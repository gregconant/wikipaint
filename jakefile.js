/*global desc, task, jake, fail, complete */
(function () {
    "use strict";

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", [], function () {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        var options = nodeLintOptions();
        lint.validateFileList(files.toArray(), options, {});
    });

    desc("Test everything");
    task("test", [], function () {
        console.log("running tests...");
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['test']);
        console.log("tests run");
    });

    desc("Integrate");
    task("integrate", ["default"], function () {
       console.log("1. these are the steps to integrate");
    });



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