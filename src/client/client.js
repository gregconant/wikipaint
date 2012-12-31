/*global describe, it, expect, dump, window, Raphael, $, alert, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {};

    self.initializeDrawingArea = function (drawingAreaElement) {

        var prevX = null,
            prevY = null,
            $jqArea = $(drawingAreaElement),
            isDragging = false;

        // returns Raphael paper object
        paper = new Raphael(drawingAreaElement);

        $(drawingAreaElement).click(function (event) {
            wikiPaint.drawLine(0,0,event.pageX, event.pageY);
        });

//        $jqArea.mousedown(function (event) {
//            isDragging = true;
//        });
//        $jqArea.mouseup(function (event) {
//            isDragging = false;
//        });
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
