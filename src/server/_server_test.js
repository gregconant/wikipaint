"use strict";

var server = require("./server.js");

exports.testNothing = function (test) {
    test.equals(4, server.number(), "number");
    test.done();
};