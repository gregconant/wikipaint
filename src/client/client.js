/*global describe, it, expect, dump, window, $*/

var wikiPaint = {};

(function () {
   "use strict";

    wikiPaint.createElement = function (){

        var div = document.createElement("div");
        div.setAttribute("id", "tdjs");
        div.setAttribute("someTestValue", "awesome");
        document.body.appendChild(div);

        dump("window loaded (client file)");
    };

}());
