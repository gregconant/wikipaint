/*global describe, it, expect, afterEach, dump, require, $, wikiPaint, Raphael*/

(function () {
    "use strict";

    var drawingDiv,
        raphPaper,
        pathFor,
        pathStringForIE9;

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

            if (raphType === "SVG") {
                expect(tagName).to.equal("svg");

            } else if(raphType === "VML") { // in IE 8
                expect(tagName).to.equal("div");
            } else {
                throw new Error("Raphael does not support browser.");
            }
        });

        it("should have the same dimensions as its enclosing div", function () {
            drawingDiv = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");

            $("body").append(drawingDiv);

            raphPaper = wikiPaint.initializeDrawingArea(drawingDiv[0]);

            expect(raphPaper.height).to.be(300);
            expect(raphPaper.width).to.be(600);
        });

        pathStringForIE9 = function(nodePath) {
            var ie9Path = /M (\d+) (\d+) L (\d+) (\d+)/;
            var ie9 = nodePath.match(ie9Path);
            return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
        };

        pathFor = function(element) {
            var ie9Path,
                ie9,
                path = element.node.attributes.d.value;
            if(path.indexOf(",") !== -1) {
                // Firefox, safari, chrome, which uses Format
                // M20,30L30,200
                return path;
            } else {
                // we're in IE9, which uses format
                // M 20 30 L 30 300
                return pathStringForIE9(path);
            }
        };

        it("should draw a line", function () {
            drawingDiv = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append(drawingDiv);

            var element,
                paper = wikiPaint.initializeDrawingArea(drawingDiv[0]);
            wikiPaint.drawLine(20, 30, 30, 300);

            var elements = [];
            paper.forEach(function (elem) {
                elements.push(elem);
            });

            expect(elements.length).to.equal(1);
            element = elements[0];

            // path to node value
            var path = pathFor(element);
            dump(path);
            //dump(element.node.attributes["d"].textContent);
            // element[0].node.attributes["d"].value

        });
    });
}());