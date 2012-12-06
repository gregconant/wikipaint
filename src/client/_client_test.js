/*global describe, it, expect, afterEach, dump, require, $, wikiPaint, Raphael*/

(function () {
    "use strict";

    var drawingDiv,
        raphPaper;

    describe("Drawing area", function () {

        afterEach(function () {
           drawingDiv.remove();
        });

        it("should be initialized with Raphael", function () {
            var tagName, raphType;

            drawingDiv = $("<div></div>");

            $("body").append(drawingDiv);

            // initialize the div (production code)
            raphPaper = wikiPaint.initializeDrawingArea(drawingDiv[0]);

            // verify div was initialized correctly
            tagName = drawingDiv.children()[0].tagName.toLowerCase();
            raphType = Raphael.type;

            if (Raphael.type === "SVG") {
                expect(tagName).to.equal("svg");

            } else { // in IE
                expect(tagName).to.equal("div");
            }
        });

        it("should have the same dimensions as its enclosing div", function () {
            drawingDiv = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");

            $("body").append(drawingDiv);

            raphPaper = wikiPaint.initializeDrawingArea(drawingDiv[0]);

            expect(raphPaper.height).to.be(300);
            expect(raphPaper.width).to.be(600);
        });
    });
}());