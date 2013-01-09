/*global describe, it, expect, dump, window, Raphael, $, alert, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {};

    self.initializeDrawingArea = function (drawingAreaElement) {

        var startX = null,
            startY = null,
            $jqArea = $(drawingAreaElement),
            isDragging = false;

        // returns Raphael paper object
        paper = new Raphael(drawingAreaElement);

        $jqArea.mousedown(function (event) {
            isDragging = true;
            var pageOffset = $jqArea.offset();
            // TODO: eliminate offset calculation
            startX = event.pageX - pageOffset.left;
            startY = event.pageY - pageOffset.top;
        });
        $jqArea.mouseup(function (event) {
            isDragging = false;
        });

        $jqArea.mousemove(function (event) {

            var pageOffset = $jqArea.offset();
            var endX = event.pageX - pageOffset.left;
            var endY = event.pageY - pageOffset.top;

            if(startX !== null && isDragging) {
                wikiPaint.drawLine(startX, startY, endX, endY);
            }
            startX = endX;
            startY = endY;
        });


//        $jqArea.mouseleave(function (event) {
//            isDragging = false;
//        });
//
//        $jqArea.mousemove(function (event) {
//            // TODO: Have to account for padding, border, margin
//            var divPageX = $jqArea.offset().left,
//                divPageY = $jqArea.offset().top,
//                relativeX = event.pageX - divPageX,
//                relativeY = event.pageY - divPageY;
//
//            if(prevX !== null && isDragging) {
//                wikiPaint.drawLine(prevX, prevY, relativeX, relativeY);
//            }
//            prevX = relativeX;
//            prevY = relativeY;
//
//        });

        return paper;
    };

    self.drawLine = function(startX, startY, endX, endY) {
        paper.path("M" + startX + ","+ startY + "L" + endX + "," + endY);
    };

    return self;

}());
