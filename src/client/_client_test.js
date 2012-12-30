/*global describe, it, expect, afterEach, beforeEach, dump, require, $, wikiPaint, Raphael*/

(function () {
    "use strict";

    var $drawingArea,
        raphPaper,
        pathFor,
        svgPathFor,
        pathStringForIE9,
        vmlPathFor,
        VML_MAGIC_NUMBER = 21600;

    describe("Drawing area", function () {

        beforeEach(function() {
           $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
           $("body").append($drawingArea);
        });

        afterEach(function () {
           $drawingArea.remove();
        });

        it("should be initialized with Raphael", function () {
            var tagName, raphType;

            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            tagName = $drawingArea.children()[0].tagName.toLowerCase();
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
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            expect(raphPaper.height).to.be(300);
            expect(raphPaper.width).to.be(600);
        });

        vmlPathFor = function(element) {
            var startX,
                startY,
                endX,
                endY,
                ie8Path = element.node.path.value,
                ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/,
                ie8 = ie8Path.match(ie8PathRegex);

            startX = ie8[1] / VML_MAGIC_NUMBER;
            startY = ie8[2] / VML_MAGIC_NUMBER;
            endX = ie8[3] / VML_MAGIC_NUMBER;
            endY = ie8[4] / VML_MAGIC_NUMBER;

            return "M" + startX + "," + startY + "L" + endX + "," + endY;
        };

        pathStringForIE9 = function(nodePath) {
            var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
            var ie9 = nodePath.match(ie9PathRegex);
            return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
        };

        svgPathFor = function(element) {
            var path = element.node.attributes.d.value;
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

        pathFor = function(element) {
            var ie8Path,
                ie9Path,
                ie9,
                path;

            if(Raphael.vml) {

                // we're in IE8, which uses format
                // m432000,648000 l648000,67456800 e

                return vmlPathFor(element);
            } else if(Raphael.svg){
                return svgPathFor(element);

            } else {
                throw new Error("Unknown Raphael type/format.");
            }
        };

        function getElements(paper) {
            var elements = [];
            paper.forEach(function (elem) {
                elements.push(elem);
            });
            return elements;
        }

        it("should draw a line", function () {
            var elements = [],
                paper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            wikiPaint.drawLine(20, 30, 30, 300);
            elements = getElements(paper);

            expect(elements.length).to.equal(1);
            expect(pathFor(elements[0])).to.equal("M20,30L30,300");

        });


    });
}());