/*global jQuery, describe, it, expect, afterEach, beforeEach, dump, require, $, wikiPaint, Raphael*/

(function () {
    "use strict";

    var $drawingArea,
        raphPaper,
        pathFor,
        svgPathFor,
        pathStringForIE9,
        vmlPathFor,
        pathObjectFromRegex,
        VML_MAGIC_NUMBER = 21600;

    describe("Drawing area", function () {
        pathObjectFromRegex = function(regex){
            return [
                regex[1],
                regex[2],
                regex[3],
                regex[4]
            ];
        };


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

            return [
                startX,
                startY,
                endX,
                endY
            ];

        };

        svgPathFor = function(element) {
            var pathComponents,
                svgPathRegex;

            var path = element.node.attributes.d.value;

            if(path.indexOf(",") !== -1) {
                // Firefox, safari, chrome, which uses format: M20,30L30,200
                svgPathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
            } else {
                // we're in IE9, which uses format: M 20 30 L 30 300
                svgPathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
            }
            pathComponents = path.match(svgPathRegex);
            return pathObjectFromRegex(pathComponents);
        };

        pathFor = function(element) {
            var ie8Path,
                ie9Path,
                ie9,
                path,
                box = element.getBBox();

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
            var elements = getElements(paper),
                result = [];
            for(var i = 0; i < elements.length; i +=1) {
                result.push(pathFor(elements[i]));
            }
            return result;
        }

        function mouseDown(relativeX, relativeY) {
            var topLeftOfDrawingArea = $drawingArea.offset(),
                pageX = relativeX + topLeftOfDrawingArea.left,
                pageY = relativeY + topLeftOfDrawingArea.top,
                eventData = new jQuery.Event("mousedown");

            eventData.pageX = pageX;
            eventData.pageY = pageY;
            $drawingArea.trigger(eventData);
        }

        function mouseUp(relativeX, relativeY) {
            var topLeftOfDrawingArea = $drawingArea.offset(),
                pageX = relativeX + topLeftOfDrawingArea.left,
                pageY = relativeY + topLeftOfDrawingArea.top,
                eventData = new jQuery.Event("mouseup");

            eventData.pageX = pageX;
            eventData.pageY = pageY;
            $drawingArea.trigger(eventData);
        }

        function mouseMove(relativeX, relativeY) {
            var topLeftOfDrawingArea = $drawingArea.offset(),
                pageX = relativeX + topLeftOfDrawingArea.left,
                pageY = relativeY + topLeftOfDrawingArea.top,
                eventData = new jQuery.Event("mousemove");

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
        it("draws a line in response to mouse drag", function() {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            mouseDown(20, 30);
            mouseMove(50, 60);

            expect(paperPaths(raphPaper)).to.eql([ [20, 30, 50, 60] ]);
        });

        it("does not draw line segment in response to mouseup event", function() {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            mouseDown(20, 30);
            mouseUp(50, 60);

            expect(paperPaths(raphPaper)).to.eql([ ]);
        });

        it("does not draw line segments when mouse is not down", function () {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            mouseMove(20, 30);
            mouseMove(50, 60);

            expect(paperPaths(raphPaper)).to.eql([]);
        });

        it("stops drawing line segments when mouse is up", function () {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            mouseDown(20, 30);
            mouseMove(50, 60);
            mouseUp(50, 60);
            mouseMove(10, 15);

            expect(paperPaths(raphPaper)).to.eql([ [20, 30, 50, 60] ]);
        });

        it("draws multiple line segments when mouse is dragged multiple places", function () {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            mouseDown(20, 30);
            mouseMove(50, 60);
            mouseMove(40, 20);
            mouseMove(10, 15);

            expect(paperPaths(raphPaper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20], [40, 20, 10, 15] ]);
        });

        it("draws multiple line segments when there are multiple drags", function () {
            $drawingArea = $("<div style='height: 300px; width:600px;'>Hi, jerk.</div>");
            $("body").append($drawingArea);
            raphPaper = wikiPaint.initializeDrawingArea($drawingArea[0]);

            mouseDown(20, 30);
            mouseMove(50, 60);
            mouseUp(50, 60);

            mouseMove(40, 20);
            mouseDown(30, 25);
            mouseMove(10, 15);
            mouseUp(10, 15);

            expect(paperPaths(raphPaper)).to.eql([ [20, 30, 50, 60], [30, 25, 10, 15] ]);
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