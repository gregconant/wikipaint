/**
 * Created with JetBrains WebStorm.
 * User: grewgsmash
 * Date: 9/22/12
 * Time: 1:55 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";

    var server = require("./server.js"),
        port = process.argv[2];
    server.start("src/server/content/homepage.html", "src/server/content/404.html", port, function () {
        process.stdout.write("Server started");
    });
}());