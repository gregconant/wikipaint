/*global describe, it, expect, dump, require, wikiPaint:true*/

(function () {
    "use strict";

    describe("Nothing", function () {

        it("should run", function () {
            wikiPaint.createElement();

            var foundDiv = document.getElementById("tdjs");
            expect(foundDiv.getAttribute("someTestValue")).to.equal("awesome");
        });
    });
}());