/* globals console, parser, print, stream */

(function () {
    "use strict";

    var prompt, ta;

    prompt = document.getElementById("prompt");
    ta = document.getElementById("lisp-input");

    ta.addEventListener("keypress", function (e) {
        //var result;

        if (e.keyCode === 13) {
            e.preventDefault();

            // if the user pressed enter, try and read
            try {
                /*
                result = lisp.html(lisp.eval(lisp.read(lisp.makeStream(ta.value)), lisp.theGlobalEnvironment));

                prompt.insertAdjacentHTML("beforebegin",
                                          "<span>&gt;&nbsp;" +
                                          ta.value +
                                          "</span><br>" +
                                          result +
                                          "<br>");
                */

                console.log(print.write(parser.read(new stream.Stream(ta.value))));

                // presume successful read
                ta.value = "";
            } catch (err) {
                console.error(err);
            }
        }
    });

    ta.focus();
})();
