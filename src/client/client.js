/*global describe, it, expect, dump, window, Raphael, $, alert, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {};

    self.initializeDrawingArea = function (drawingAreaElement) {
        // returns Raphael paper object
        paper = new Raphael(drawingAreaElement);
        $(drawingAreaElement).click(function (event) {
            // TODO: Have to account for padding, border, margin
            var divPageX = $(drawingAreaElement).offset().left,
                divPageY = $(drawingAreaElement).offset().top,
                relativeX = event.pageX - divPageX,
                relativeY = event.pageY - divPageY;

            wikiPaint.drawLine(0, 0, relativeX, relativeY);

        });

        return paper;
    };

    self.drawLine = function(startX, startY, endX, endY) {
        paper.path("M" + startX + ","+ startY + "L" + endX + "," + endY);
    };

    return self;

}());
