/*global describe, it, expect, dump, require, wikiPaint*/

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
            var foundDiv = document.getElementById("wikipaint-drawing-area");
            expect(foundDiv.getAttribute("blah")).to.equal("bleah");

            expect(foundDiv).to.be.ok();
        });
    });
}());