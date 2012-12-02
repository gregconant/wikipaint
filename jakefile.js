/*global desc, describe, task, jake, fail, complete, directory, console, process*/

(function () {
    "use strict";

    if(!process.env.loose) {
        console.log("For more forgiving test settings, use 'loose=true'");
    }

    var NODE_VERSION = "v0.8.10",
        GENERATED_DIR = "generated",
        TEMP_TESTFILE_DIR = GENERATED_DIR + "/test",
        lint = require("./build/lint/lint_runner.js"),
        nodeUnit = require("nodeunit").reporters["default"],
        SUPPORTED_BROWSERS = [
            "IE 9.0",
            "Chrome 23.0",
            "Firefox 16.0"
        ];

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
    task("default", ["lint", "test"], function () {
        console.log("\n\nOK");
    });

    desc("Start testacular server for testing");
    task("testacular", function () {
        sh("start-testacular.bat", complete, "could not start Testacular server");

    }, { async: true });

    desc("Lint everything");
    task("lint", ["lintNode", "lintClient"]);

    desc("Test everything");
    task("test", ["testNode", "testClient"]);

    function clientFiles() {
        var javascriptFiles = new jake.FileList();
        javascriptFiles.include("src/client/**/*.js");
        return javascriptFiles.toArray();
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

    function checkIfBrowserTested(browserName, output) {
        var searchString = browserName + ": Executed";

        var missing = output.indexOf(searchString) === -1;
        if(missing) {
            console.log(browserName + " was not tested!");
        }
        return missing;
    }

    desc("Test client code");
    task("testClient", function () {
        console.log("TESTING CLIENT");
        var browserMissing = false,
            config = {},
            oldStdOut = process.stdout.write,
            output = "";
            // we are going to override process.stdout.write function for now,
            // because it is what testacular writes to, and we want to redirect its
            // output
        process.stdout.write = function(data) {
            output += data;
            oldStdOut.apply(this, arguments);
        };

        require("testacular/lib/runner").run(config, function (exitCode) {
            process.stdout.write = oldStdOut;
            if (exitCode) {
                fail ("Client tests failed (to start server, run 'jake testacular')");
            }
            SUPPORTED_BROWSERS.forEach(function (browser) {
                browserMissing = checkIfBrowserTested(browser, output) || browserMissing;
            });
            if(browserMissing && !process.env.loose) {
                fail("Did not test all supported browsers (use 'loose=true' to suppress this message.");
            }
            console.log("Done running testacular");
            if(output.indexOf("TOTAL: 0 SUCCESS") !== -1) {
                fail("Client tests did not run!");
            }
            console.log("captured output: " + output);
        });
        complete();
    }, {async: true});

    function nodeFiles() {
        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        files.exclude("testacular.conf.js");
        files.exclude("src\\client");
        files.exclude("vendor_client");
        return files.toArray();
    }

    function nodeTestFiles() {
        var testFiles = new jake.FileList();
        testFiles.include("**/_*_test.js");
        testFiles.exclude("./node_modules");
        testFiles.exclude("src\\client");
        return testFiles.toArray();
    }

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
        var testFiles = nodeTestFiles();

        console.log("TESTING NODE FILES");

        console.log("files: [" + testFiles + "]");
        nodeUnit.run(testFiles, null, function (failures) {
            if (failures) {
                fail("Tests failed");
            }

        });
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