/*global describe, it, expect, afterEach, dump, require, $, wikiPaint*/

(function () {
    "use strict";

    var testDiv,
        drawingArea,
        raphPaper;

    describe("Drawing area", function () {

        afterEach(function () {
           $("#" + drawingAreaId).remove();
            $("#my-test-div").remove();
        });

        it("should be initialized in predefined div", function () {
            testDiv = $("<div></div>");

            $("body").append(testDiv);

            // initialize the div (production code)
            somePaper = wikiPaint.initializeDrawingArea(testDiv[0]);

            // verify div was initialized correctly
            var tagName = testDiv.children()[0].tagName.toLowerCase();
            if (tagName === "svg") {
                expect(tagName).to.equal("svg");

            } else { // in IE
                expect(tagName).to.equal("div");
            }
        });

        it("should have the same dimensions as its enclosing div", function () {
            testDiv = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");

            $("body").append(testDiv);

            raphPaper = wikiPaint.initializeDrawingArea(drawingArea[0]);

            expect(raphPaper.height).to.be(300);
            expect(raphPaper.width).to.be(600);
        });
    });
}());