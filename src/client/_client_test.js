/*global describe, it, expect, dump, require*/

(function () {
    "use strict";

    describe("Nothing", function () {

        it("should run", function () {
            var foundDiv = document.getElementById("tdjs");
            expect(foundDiv.getAttribute("foo")).to.equal("bar");
        });
    });
}());