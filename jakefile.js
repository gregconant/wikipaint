/*global desc, task, jake, fail, complete */
(function () {
    "use strict";

    var NODE_VERSION = "v0.8.9",
        GENERATED_DIR = "generated",
        TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

    directory(TEMP_TESTFILE_DIR);


    desc("Delete all generated files");
    task("clean", function () {
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
            node: true
        };
    }

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything");
    task("lint", ["nodeVersion"], function () {
        var lint = require("./build/lint/lint_runner.js"),
            files = new jake.FileList(),
            options = nodeLintOptions();

        files.include("**/*.js");
        files.exclude("node_modules");

        lint.validateFileList(files.toArray(), options, {});
    });


    desc("Test everything");
    task("test", ["nodeVersion", TEMP_TESTFILE_DIR], function () {
        var javascriptFiles = new jake.FileList();

        javascriptFiles.include("**/_*_test.js");
        javascriptFiles.exclude("node_modules");
        javascriptFiles.exclude("/src/client/**");

        var reporter = require("nodeunit").reporters["default"];
        reporter.run(javascriptFiles.toArray(), null, function (failures) {
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

//	desc("Ensure correct version of Node is present. Use 'strict=true' to require exact match");
    task("nodeVersion", [], function () {
        var expectedString = NODE_VERSION,
            actualString = process.version,
            expected = parseNodeVersion("expected Node version", expectedString),
            actual = parseNodeVersion("Node version", actualString);

        function failWithQualifier(qualifier) {
            fail("Incorrect node version. Expected " + qualifier +
                     " [" + expectedString + "], but was [" + actualString + "].");
        }

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

}());