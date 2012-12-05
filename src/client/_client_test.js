/*global describe, it, expect, afterEach, dump, require, $, wikiPaint*/

(function () {
    "use strict";

    describe("Drawing area", function () {

        afterEach(function () {
           $("#wikipaint-drawing-area").remove();
            $("#my-test-div").remove();
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
            var drawingAreaId = "#wikipaint-drawing-area",
                testDivId = "#my-test-div",
                div = $(drawingAreaId);

            expect(div.length).to.equal(0);

            // create div that's assumed to be in our home page
            var testHtml = "<div id='my-test-div' style='height: 200px; width:400px;'>Hi, jerk.</div>";

            $("body").append(testHtml);
            dump("hi");
            var element = $("body").find(testDivId);
            expect(element).to.be.ok();
            expect($(testDivId).height()).to.be(200);
            expect($(testDivId).width()).to.be(400);

        });
    });
}());