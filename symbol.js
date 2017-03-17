(function () {
    "use strict";

    var symbolTable;

    symbolTable = {};

    window.Symbol = function (value) {
        this.value = value;
    };

    window.makeSymbol = function (value) {
        var obj;

        if (symbolTable[value]) {
            return symbolTable[value];
        }

        obj = new window.Symbol(value);

        symbolTable[value] = obj;

        return obj;
    };
})();
