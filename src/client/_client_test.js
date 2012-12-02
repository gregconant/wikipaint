/*global describe, it, expect, dump, require, wikiPaint*/

(function () {
    "use strict";

    describe("Drawing area", function () {

        it("should be initialized in predefined div", function () {
            // create div that's assumed to be in our home page
            var div = document.createElement("div");
            div.setAttribute("id", "wikipaint-drawing-area");
            document.body.appendChild(div);

            // initialize the div (production code)
            wikiPaint.initializeDrawingArea();

            // verify div was initialized correctly
            var foundDiv = document.getElementById("wikipaint-drawing-area");

            expect(foundDiv).to.be.ok();
        });
    });
}());