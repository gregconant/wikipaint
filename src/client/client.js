/*global describe, it, expect, dump, window, Raphael, $, alert, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {};

    self.initializeDrawingArea = function (drawingAreaElement) {

        var start = null,
            end = null,
            $jqArea = $(drawingAreaElement),
            isDragging = false,

            relativeOffset = function(absoluteX, absoluteY) {
                var pageOffset = $jqArea.offset();

                return {
                    x: absoluteX - pageOffset.left,
                    y: absoluteY - pageOffset.top
                };
            };

        // returns Raphael paper object
        paper = new Raphael(drawingAreaElement);

        $jqArea.mousedown(function (event) {
            start = relativeOffset(event.pageX, event.pageY);
        });

        $jqArea.mouseup(function (event) {
            start = null;
        });

        $jqArea.mousemove(function (event) {
            end = relativeOffset(event.pageX, event.pageY);
            if(start === null) {
                return;
            }
            else {
                wikiPaint.drawLine(start.x, start.y, end.x, end.y);
            }

            start = end;
        });

        return paper;
    };

    self.drawLine = function(startX, startY, endX, endY) {
        paper.path("M" + startX + ","+ startY + "L" + endX + "," + endY);
    };

    return self;

}());
