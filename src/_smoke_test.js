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

    var child_process = require("child_process");

    exports.test_for_smoke = function (test) {
        var command = "node wikipaint 8080";
        child_process.exec(command, function (error, stdout, stderr) {
            if (error !== null) {
                console.log(stderr);
                console.log(stdout);
                throw error;
            }
            console.log("callback");
            test.done();
        });
    };

    function runProcess(command) {

    }

}());