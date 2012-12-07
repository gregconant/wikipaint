/*global describe, it, expect, dump, window, Raphael, $, wikiPaint:true */

wikiPaint = {};

(function () {
   "use strict";

    wikiPaint.initializeDrawingArea = function (drawingAreaElement) {
        // returns Raphael paper object
        var paper = new Raphael(drawingAreaElement);

        paper.path("M20,30L200,20");

        return paper;
    };

    wikiPaint.drawLine = function(startX, startY, endX, endY) {

    };

}());
