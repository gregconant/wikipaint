/*global describe, it, expect, afterEach, dump, require, $, wikiPaint*/

(function () {
    "use strict";

    var drawingAreaId = "wikipaint-drawing-area";

    describe("Drawing area", function () {

        afterEach(function () {
           $("#" + drawingAreaId).remove();
            $("#my-test-div").remove();
        });

        it("should be initialized in predefined div", function () {
            // create div that's assumed to be in our home page
            var div = document.createElement("div"),
                somePaper;

            div.setAttribute("id", drawingAreaId);
            div.setAttribute("blah", "bleah");
            document.body.appendChild(div);

            // initialize the div (production code)
            somePaper = wikiPaint.initializeDrawingArea(drawingAreaId);

            // verify div was initialized correctly
            var tagName = $(div).children()[0].tagName.toLowerCase();
            if (tagName === "svg") {
                expect(tagName).to.equal("svg");

            } else { // in IE
                expect(tagName).to.equal("div");
            }
        });

        it("should have the same dimensions as its enclosing div", function () {
            // create div that's assumed to be in our home page
            var testHtml = "<div style='height: 200px; width:400px;'>Hi, jerk.</div>",
                raphPaper;

            $("body").append(testHtml);

            raphPaper = wikiPaint.initializeDrawingArea(drawingAreaId);

            expect(raphPaper.height).to.be(200);
            expect(raphPaper.width).to.be(400);

        });
    });
}());