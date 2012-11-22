/*global desc, describe, task, jake, fail, complete, directory*/

(function () {
    "use strict";

    var NODE_VERSION = "v0.8.10",
        GENERATED_DIR = "generated",
        TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

    directory(TEMP_TESTFILE_DIR);

    desc("Delete all generated files");
    task("clean", [], function () {
        jake.rmRf(GENERATED_DIR);

    });

    function parseNodeVersion(description, versionString) {
        var versionMatcher = /^v(\d+)\.(\d+)\.(\d+)$/,    // v[major].[minor].[bugfix]
            versionInfo = versionString.match(versionMatcher),
            major = parseInt(versionInfo[1], 10),
            minor = parseInt(versionInfo[2], 10),
            bugfix = parseInt(versionInfo[3], 10);

        if (versionInfo === null) {
            fail("Could not parse " + description + " (was '" + versionString + "')");
        }

        return [major, minor, bugfix];
    }

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
            node: true,
            indent: true,
            plusplus: true
        };
    }

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", ["nodeVersion"], function () {
        var lint = require("./build/lint/lint_runner.js"),
            passed,
            javascriptFiles = new jake.FileList(),
            options = nodeLintOptions(),
            globals = { };

        javascriptFiles.include("./**/*.js");
        javascriptFiles.exclude("./node_modules");
        javascriptFiles.exclude("./testacular.conf.js");
        //javascriptFiles.exclude("./src/client/_client_test.js");

        passed = lint.validateFileList(javascriptFiles.toArray(), options, globals);
        if (!passed) {
            fail("Lint failed");
        }
    });

    desc("Test everything");
    task("test", ["testServer", "testClient"]);

    desc("Test server code");
    task("testServer", ["nodeVersion", TEMP_TESTFILE_DIR], function () {
        var testFiles = new jake.FileList();

        testFiles.include("**/_*_test.js");
        testFiles.exclude("node_modules");
        testFiles.exclude("src/client/**");

        var reporter = require("nodeunit").reporters["default"];
        reporter.run(testFiles.toArray(), null, function (failures) {
            if (failures) {
                fail("Tests failed");
            }
            complete();
        }
            );
    }, {async: true});

    desc("Test client code");
    task("testClient", function () {
        var config = {};
        sh("testacular.sh run", "Client tests failed", function () {
            console.log("AFTER TESTS");
        });

    }, {async: true});

    desc("Deploy to Heroku");
    task("deploy", ["default"], function() {
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. 'git push heroku master'");
        console.log("3. 'jake test'");
    });

//	desc("Ensure correct version of Node is present. Use 'strict=true' to require exact match");
    task("nodeVersion", [], function () {
        var expectedString = NODE_VERSION,
            actualString = process.version,
            expected = parseNodeVersion("expected Node version", expectedString),
            actual = parseNodeVersion("Node version", actualString),
            failWithQualifier = function(qualifier) {
                fail("Incorrect node version. Expected " + qualifier +
                    " [" + expectedString + "], but was [" + actualString + "].");
            };

        if (process.env.strict) {
            if (actual[0] !== expected[0] || actual[1] !== expected[1] || actual[2] !== expected[2]) {
                failWithQualifier("exactly");
            }
        } else {
            if (actual[0] < expected[0]) {
                failWithQualifier("at least");
            }
            if (actual[0] === expected[0] && actual[1] < expected[1]) {
                failWithQualifier("at least");
            }
            if (actual[0] === expected[0] && actual[1] === expected[1] && actual[2] < expected[2]) {
                failWithQualifier("at least");
            }
        }
        console.log("Node version '" + actualString + "' is at least expected version of '" + expectedString + "'");

    });

    desc("Integrate");
    task("integrate", ["default"], function () {
        console.log("1. these are the steps to integrate");
    });

}());