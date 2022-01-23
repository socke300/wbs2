"use strict";
exports.__esModule = true;
exports.ToDoEntry = void 0;
var ToDoEntry = /** @class */ (function () {
    function ToDoEntry(title, date) {
        this.title = title;
        this.date = new Date();
        this.done = false;
        this.index = 0;
        if (date)
            this.date = date;
    }
    return ToDoEntry;
}());
exports.ToDoEntry = ToDoEntry;
//# sourceMappingURL=ToDoEntry.js.map