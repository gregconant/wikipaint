/*global jQuery, describe, it, expect, afterEach, beforeEach, dump, require, $, wikiPaint, Raphael*/

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

        });

        afterEach(function () {
           $drawingArea.remove();
        });

        it("should have the same dimensions as its enclosing div", function () {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
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
                // Firefox, safari, chrome, which uses format: M20,30L30,200
                return path;
            } else {
                // we're in IE9, which uses format: M 20 30 L 30 300
                return pathStringForIE9(path);
            }
        };

        pathFor = function(element) {
            var ie8Path,
                ie9Path,
                ie9,
                path,
                box = element.getBBox();

            //dump(JSON.stringify(box));
            return "M" + box.x + "," + box.y+ "L" + box.x2 + "," + box.y2;

            /*if(Raphael.vml) {
                // we're in IE8, which uses format
                // m432000,648000 l648000,67456800 e
                return vmlPathFor(element);
            } else if(Raphael.svg){
                return svgPathFor(element);
            } else {
                throw new Error("Unknown Raphael type/format.");
            }*/
        };

        function getElements(paper) {
            var elements = [];
            paper.forEach(function (elem) {
                elements.push(elem);
            });
            return elements;
        }

        it("should draw a line", function () {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            var elements = [];

            wikiPaint.drawLine(20, 30, 30, 300);
            elements = getElements(raphPaper);

            expect(elements.length).to.equal(1);
            expect(pathFor(elements[0])).to.equal("M20,30L30,300");

        });

        function clickMouse(pageX, pageY) {
            var eventData = new jQuery.Event("click");

            eventData.pageX = pageX;
            eventData.pageY = pageY;
            $drawingArea.trigger(eventData);
        }

        function relativePosition($area, pageX, pageY) {
            var topLeftOfDrawingArea = $area.offset(),
                x = pageX - topLeftOfDrawingArea.left,
                y = pageY - topLeftOfDrawingArea.top;

            return {x: x, y: y};
        }

        it("draws line segments in response to clicks", function () {
            // click inside drawing area
            var topLeftOfDrawingArea,
                expectedX,
                expectedY,
                eventData;

            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            clickMouse(20, 30);

            var position = relativePosition($drawingArea, 20, 30);

            var elements = getElements(raphPaper);
            expect(elements.length).to.equal(1);
            expect(pathFor(elements[0])).to.equal("M0,0L" + position.x + "," + position.y);

            //TODO: test accounting for margin, border, padding
        });

//        it("considers border when calculating mouse target", function () {
//            $drawingArea = $("<div style='height: 300px; width:600px; border-width:13px;'>Hi, jerk.</div>");
//            $("body").append($drawingArea);
//            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);
//
//            var topLeftOfDrawingArea,
//                expectedX,
//                expectedY,
//                eventData = new jQuery.Event("click"),
//                borderWidth = 13;
//
//            eventData.pageX = 20;
//            eventData.pageY = 30;
//
//            $drawingArea.trigger(eventData);
//
//            topLeftOfDrawingArea = $drawingArea.offset();
//
//            expectedX = 20 - topLeftOfDrawingArea.left - borderWidth;
//            expectedY = 30 - topLeftOfDrawingArea.top - borderWidth;
//
//            expectedX = 20;
//            expectedY = 30;
//
//            dump(JSON.stringify($drawingArea.offset()));
//            // verify a line was drawn (from 0,0 to click location)
//
//            var elements = getElements(raphPaper);
//            expect(elements.length).to.equal(1);
//            expect(pathFor(elements[0])).to.equal("M0,0L" + expectedX + "," + expectedY);
//        });

        //TODO: test that em is converted to px

    });
}());