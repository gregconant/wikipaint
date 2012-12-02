/*global describe, it, expect, dump, window*/

(function () {
   "use strict";

    window.onload = function (){
        var div = document.createElement("div");
        div.setAttribute("id", "tdjs");
        div.setAttribute("foo", "bar");
        document.body.appendChild(div);

        dump("window loaded (client file)");
    };

}());
