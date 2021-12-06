"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var UserError;
(function (UserError) {
    UserError["userNotFound"] = "User not found.";
})(UserError || (UserError = {}));
// Data
var data = {
    4876: {
        name: "Alex",
        role: 1,
    },
    5412: {
        name: "Kim",
        role: 0,
    },
};
// Finds a user with the given ID.
function getUserData(id) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var user = data[id];
            if (user == null) {
                reject(UserError.userNotFound);
            }
            else {
                resolve(user);
            }
        }, 1000);
    });
}
// Checks, if the given user is an admin.
function isAdmin(user) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (user.role === 1) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }, 1000);
    });
}
// Performs a generic admin task, that has a result value.
function performAdminTask() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("87944551335548");
        }, 1000);
    });
}
// Performs a generic user task, that has no result.
function performUserTask() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000);
    });
}
// Performs either an admin or an user task, based on the role of the given user.
function performTaskOnUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, userIsAdmin, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, getUserData(userId)];
                case 1:
                    user = _a.sent();
                    console.log("User selected: " + user.name);
                    return [4 /*yield*/, isAdmin(user)];
                case 2:
                    userIsAdmin = _a.sent();
                    if (!userIsAdmin) return [3 /*break*/, 4];
                    return [4 /*yield*/, performAdminTask()];
                case 3:
                    result = _a.sent();
                    console.log("Result of admin task: " + result);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, performUserTask()];
                case 5:
                    _a.sent();
                    console.log("The user task was successful.");
                    _a.label = 6;
                case 6:
                    console.log("All tasks finished.");
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/*async function performTaskOnUser(userId: string): Promise<void> {
  await getUserData(userId).then(async (user: User) => {
    console.log(`User selected: ${user.name}`);
    await isAdmin(user);
  }).then(async (userIsAdmin) => {
    if(userIsAdmin){

    }
  })
}*/
// The main programm, which performs the user's corresponding tasks.
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, performTaskOnUser("4876")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, performTaskOnUser("5412")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, performTaskOnUser("0000")];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Run the main programm.
main();
