"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
var Configuration = /** @class */ (function () {
    function Configuration() {
    }
    /**
     * This skeleton file works as a template.
     * Copy this file ill in the information in the mysqlOptions-object and save it as a typescript file: "config.ts"
     * Don't forget to compile it into JavaScript after saving. The name of the file should not be touched!
     * It is marked to be ignored by git since it is a system-specific configuration and should
     * not be overwritten by other team members.
     * You can remove this comment from the ts file afterwards.
     */
    Configuration.mysqlOptions = {
        database: 'userman',
        host: 'localhost',
        password: '',
        user: 'root',
    };
    Configuration.sessionOptions = {
        cookie: {
            maxAge: 5 * 60 * 1000,
        },
        name: '',
        resave: true,
        rolling: true,
        saveUninitialized: true,
        secret: 'kekw',
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=config.js.map