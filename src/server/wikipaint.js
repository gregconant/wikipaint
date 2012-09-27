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
        CONTENT_DIR = "src/server/content",
        port = process.argv[2];
    server.start(CONTENT_DIR + "/homepage.html", CONTENT_DIR + "/404.html", port, function () {
        process.stdout.write("Server started");
    });
}());