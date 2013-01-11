/*global describe, it, expect, dump, window, Raphael, $, alert, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {},
        relativeOffset;

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
            wikiPaint.drawLine(start.x, start.y, end.x, end.y);
            start = end;
        });

        $jqArea.mouseup(function (event) {
            start = null;
        });
    }

    self.initializeDrawingArea = function (drawingAreaElement) {

        paper = new Raphael(drawingAreaElement); // returns Raphael paper object

        handleDragEvents(drawingAreaElement);

        return paper;
    };

    self.drawLine = function(startX, startY, endX, endY) {
        paper.path("M" + startX + ","+ startY + "L" + endX + "," + endY);
    };

    relativeOffset = function($element, absoluteX, absoluteY) {
        var pageOffset = $element.offset();

        return {
            x: absoluteX - pageOffset.left,
            y: absoluteY - pageOffset.top
        };
    };


    return self;

}());
