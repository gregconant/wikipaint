/*global describe, it, expect, dump, window, Raphael, $, wikiPaint:true */

wikiPaint = {};

(function () {
   "use strict";

    wikiPaint.initializeDrawingArea = function (drawingAreaElement) {
        // returns Raphael paper object
        return new Raphael(drawingAreaElement);
    };

}());
