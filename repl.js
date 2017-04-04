/* globals lisp, print */

(function () {
    "use strict";

    var prompt, ta;

    prompt = document.getElementById("prompt");
    ta = document.getElementById("lisp-input");

    ta.addEventListener("keypress", function (e) {
        var result;

        if (e.keyCode === 13) {
            e.preventDefault();

            // if the user pressed enter, try and read
//            try {
                result = lisp.readEval(ta.value);

                prompt.insertAdjacentHTML("beforebegin",
                                          "<span>&gt;&nbsp;" +
                                          ta.value +
                                          "</span><br>" +
                                          print.html(result) +
                                          "<br>");

                //console.log(print.write(result));

                ta.value = "";
//            } catch (err) {
//                console.error(err);
//            }
        }
    });

    lisp.readEval(document.getElementById("core").innerText);

    ta.focus();
})();
