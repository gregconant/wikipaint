/*global describe, it, expect, afterEach, dump, require, $, wikiPaint*/

(function () {
    "use strict";

    var drawingAreaId = "wikipaint-drawing-area",
        drawingArea;

    describe("Drawing area", function () {

        afterEach(function () {
           $("#" + drawingAreaId).remove();
            $("#my-test-div").remove();
        });

        it("should be initialized in predefined div", function () {
            var testHtml = $("<div></div>"),
                somePaper;

            $("body").append(testHtml);

            // initialize the div (production code)
            somePaper = wikiPaint.initializeDrawingArea(testHtml[0]);

            // verify div was initialized correctly
            var tagName = testHtml.children()[0].tagName.toLowerCase();
            if (tagName === "svg") {
                expect(tagName).to.equal("svg");

            } else { // in IE
                expect(tagName).to.equal("div");
            }
        });

        it("should have the same dimensions as its enclosing div", function () {
            var testHtml = "<div id='" + drawingAreaId + "' style='height: 300px; width:600px;'>Hi, jerk.</div>",
                raphPaper;

            drawingArea = $(testHtml);

            $("body").append(drawingArea);

            raphPaper = wikiPaint.initializeDrawingArea(drawingArea[0]);

            expect(raphPaper.height).to.be(300);
            expect(raphPaper.width).to.be(600);
        });
    });
}());