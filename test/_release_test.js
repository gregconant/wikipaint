/**
 * Created with JetBrains WebStorm.
 * User: grewgsmash
 * Date: 9/30/12
 * Time: 5:21 PM
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

    exports.test_isOnWeb = function (test) {
        httpGet("http://mighty-hollows-6403.herokuapp.com", function (response, receivedData) {
            console.log("got home page from heroku!");
            var foundHomePage = (receivedData.indexOf("Welcome to WikiPaint!") !== -1);
            test.ok(foundHomePage, "home page should have contained 'Welcome to WikiPaint!'.");
            test.done();
        });
    };

}());