/*global describe, it, expect, afterEach, dump, require, $, wikiPaint*/

(function () {
    "use strict";

    describe("Drawing area", function () {

        afterEach(function () {
           $("#wikipaint-drawing-area").remove();
        });

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
            // assert that DOM element from above test does not endure
            var div = $("#wikipaint-drawing-area");
            expect(div.length).to.equal(0);

            // create div that's assumed to be in our home page
            var testHtml = "<div id='my-test-div' style='height: 200px; width:400px; border:1px solid yellow;'>Hi, jerk.</div>",
                drawingAreaId = "wikipaint-drawing-area";

            $("body").append(testHtml);
            dump("hi");
            var element = $("body").find("#my-test-div");
            expect(element).to.be.ok();

        });
    });
}());