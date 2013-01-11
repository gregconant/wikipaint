/*global describe, it, expect, dump, window, Raphael, $, alert, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {},
        relativeOffset,
        drawLine;

    self.initializeDrawingArea = function (drawingAreaElement) {

        paper = new Raphael(drawingAreaElement); // returns Raphael paper object

        handleDragEvents(drawingAreaElement);

        return paper;
    };

    function handleDragEvents(drawingAreaElement) {
        var start = null,
            $jqArea = $(drawingAreaElement);

        $jqArea.mousedown(function (event) {
            start = relativeOffset($jqArea, event.pageX, event.pageY);
        });

        $jqArea.mousemove(function (event) {
            if (start === null) {
                return;
            }
            var end = relativeOffset($jqArea, event.pageX, event.pageY);
            drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });

        $jqArea.mouseup(function (event) {
            start = null;
        });
    }

    drawLine = function(startX, startY, endX, endY) {
        paper.path("M" + startX + ","+ startY + "L" + endX + "," + endY);
    };

    relativeOffset = function($element, pageX, pageY) {
        var pageOffset = $element.offset();

        return {
            x: pageX - pageOffset.left,
            y: pageY - pageOffset.top
        };
    };


    return self;

}());
