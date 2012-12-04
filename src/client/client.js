/*global describe, it, expect, dump, window, $, wikiPaint:true, Raphael*/

wikiPaint = {};

(function () {
   "use strict";

    var raphael = Raphael;

    wikiPaint.initializeDrawingArea = function (drawingAreaId) {

        var paper = raphael(drawingAreaId);

    };

}());
