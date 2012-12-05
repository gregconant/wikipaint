/*global describe, it, expect, dump, require, $, wikiPaint*/

(function () {
    "use strict";

    describe("Drawing area", function () {

        it("should be initialized in predefined div", function () {
            // create div that's assumed to be in our home page
            var div = document.createElement("div"),
                drawingAreaId = "wikipaint-drawing-area";

            div.setAttribute("id", drawingAreaId);
            div.setAttribute("blah", "bleah");
            document.body.appendChild(div);

            // initialize the div (production code)
            wikiPaint.initializeDrawingArea(drawingAreaId);

            // verify div was initialized correctly
            var tagName = $(div).children()[0].tagName.toLowerCase();
            if (tagName === "svg") {
                expect(tagName).to.equal("svg");

            } else { // in IE
                expect(tagName).to.equal("div");
            }
        });

        it("should have the same dimensions as its enclosing div", function () {

        });
    });
}());