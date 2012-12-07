/*global describe, it, expect, dump, window, Raphael, $, wikiPaint:true */

wikiPaint = (function () {
   "use strict";

    var paper,
        self = {};

    self.initializeDrawingArea = function (drawingAreaElement) {
        // returns Raphael paper object
        paper = new Raphael(drawingAreaElement);

        return paper;
    };

    self.drawLine = function(startX, startY, endX, endY) {
        paper.path("M1,1L2,2");
    };

    return self;

}());
