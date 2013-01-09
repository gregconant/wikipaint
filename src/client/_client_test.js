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

            return {
                x: startX,
                y: startY,
                x2: endX,
                y2: endY
            };

            //return "M" + startX + "," + startY + "L" + endX + "," + endY;
        };

        pathStringForIE9 = function(nodePath) {
            var ie9PathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
            var ie9 = nodePath.match(ie9PathRegex);

            return {
                x: ie9[1],
                y: ie9[2],
                x2: ie9[3],
                y2: ie9[4]
            };

            //return "M" + ie9[1] + "," + ie9[2] + "L" + ie9[3] + "," + ie9[4];
        };

        svgPathFor = function(element) {
            var svg,
                svgPathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;

            var path = element.node.attributes.d.value;


            if(path.indexOf(",") !== -1) {
                svg = path.match(svgPathRegex);
                // Firefox, safari, chrome, which uses format: M20,30L30,200

                return {
                    x: svg[1],
                    y: svg[2],
                    x2: svg[3],
                    y2: svg[4]
                };
                //return path;
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
            //return "M" + box.x + "," + box.y+ "L" + box.x2 + "," + box.y2;

            if(Raphael.vml) {
                // we're in IE8, which uses format
                // m432000,648000 l648000,67456800 e
                return vmlPathFor(element);
            } else if(Raphael.svg) {
                return svgPathFor(element);
            } else {
                throw new Error("Unknown Raphael type/format.");
            }
        };


        function paperPaths(paper) {
            // note: paths are normalized with left side first in all cases
            var elements = getElements(paper),
                result = [],
                box;

            for(var i = 0; i < elements.length; i +=1) {
                box = pathFor(elements[i]);

                result.push([ box.x, box.y, box.x2, box.y2]);
            }
            dump(result);
            return result;

        }

        function clickMouse(relativeX, relativeY) {
            var topLeftOfDrawingArea = $drawingArea.offset(),
                pageX = relativeX + topLeftOfDrawingArea.left,
                pageY = relativeY + topLeftOfDrawingArea.top,
                eventData = new jQuery.Event("click");

            eventData.pageX = pageX;
            eventData.pageY = pageY;
            $drawingArea.trigger(eventData);
        }


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

            expect(paperPaths(raphPaper)).to.eql([ [20, 30, 30, 300 ] ]);

//            elements = getElements(raphPaper);
//            expect(elements.length).to.equal(1);
//            expect(pathFor(elements[0])).to.equal("M20,30L30,300");

        });

        it("draws line segments in response to clicks", function () {
            // click inside drawing area
            var topLeftOfDrawingArea,
                expectedX,
                expectedY,
                eventData;

            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            // these points are offsets, not absolute page points. need to add relative position.
            clickMouse(20, 30);
            clickMouse(50, 60);
            clickMouse(40, 20);

            expect(paperPaths(raphPaper)).to.eql([[20, 30, 50, 60], [50,60,40,20]]);
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