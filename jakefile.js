/*global desc, describe, task, jake, fail, complete, directory, console*/

(function () {
    "use strict";

    var NODE_VERSION = "v0.8.10",
        GENERATED_DIR = "generated",
        TEMP_TESTFILE_DIR = GENERATED_DIR + "/test",
        lint = require("./build/lint/lint_runner.js");

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

    function sh(command, onCommandEnd, errorMessage) {
        var stdout = "",
            process;

        console.log(">" + command);

        process = jake.createExec(command, { printStdout: true, printStderr: true });

        process.addListener("stdout", function (chunk) {
            stdout += chunk;
        });
        process.addListener("error", function (msg, code) {
            fail("error code " + code + ": " + msg);
        });
        process.addListener("cmdEnd", function () {
            // remove whitespace from end of string returned so comparison will work
            onCommandEnd(stdout);
        });
        process.run();
    }

    function globalLintOptions() {
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
            indent: true,
            plusplus: true
        };
    }

    function browserLintOptions() {
        var opts = globalLintOptions();
        opts.browser = true;
        return opts;
    }

    function nodeLintOptions() {
        var opts = globalLintOptions();
        opts.node = true;
        return opts;
    }

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", ["lintNode", "lintClient"]);

    desc("Test everything");
    task("test", ["testClient", "testNode"]);

    function clientFiles() {
        var javascriptFiles = new jake.FileList();
        javascriptFiles.include("src/client/**/*.js");
        return javascriptFiles.toArray();
    }

    function nodeFiles() {
        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        files.exclude("testacular.conf.js");
        return files.toArray();
    }

    desc("Lint client");
    task("lintClient", [], function () {
        var passed,
            clientJs = clientFiles();

        console.log("Linting client files...");
        console.log(clientJs);
        passed = lint.validateFileList(clientJs, browserLintOptions(), { });
        if (!passed) {
            fail("Client lint failed");
        }
    });

    desc("Lint node");
    task("lintNode", ["nodeVersion"], function () {
        var passed,
            options = nodeLintOptions(),
            globals = { },
            nodeJsFiles = nodeFiles();

        console.log("Linting node files...");
        console.log(nodeJsFiles);

        passed = lint.validateFileList(nodeJsFiles, options, globals);
        if (!passed) {
            fail("Node lint failed");
        }
    });

    desc("Test server code");
    task("testNode", ["nodeVersion"], function () {
        var testFiles = new jake.FileList();

        console.log("TESTING NODE FILES");

        testFiles.include("**/_*_test.js");
        testFiles.exclude("./node_modules");
        testFiles.exclude("src\\client\\_client_test.js");

        var reporter = require("nodeunit").reporters["default"];
        console.log("files: " + testFiles.toArray());
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
        console.log("TESTING CLIENT");
        sh("run-testacular.bat", function (stdout) {
            console.log("Done running testacular");
            console.log(stdout);
        }, "Client tests failed");
        complete();
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