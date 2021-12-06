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
Object.defineProperty(exports, "__esModule", { value: true });
/*****************************************************************************
 * Import package                                                            *
 *****************************************************************************/
var express = require("express");
var socket_io_1 = require("socket.io");
var user_1 = require("../model/user");
var mysql = require("mysql");
var config_1 = require("../config/config"); // handles database connections
var session = require("express-session");
var rights_1 = require("../model/rights");
var cryptoJS = require("crypto-js");
/*****************************************************************************
 * Define and start web-app server, define json-Parser                       *
 *****************************************************************************/
var app = express();
var database = mysql.createConnection(config_1.Configuration.mysqlOptions);
var server = app.listen(8080, function () {
    console.log('Server started: http://localhost:8080');
});
//---- Socket setup & pass server -----------------------------------
var io = new socket_io_1.Server(server);
io.on('connection', function (socket) {
    //-- connection and disconnection
    console.log('made socket connection with', socket.id);
    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });
    //-- Handle socket-events
    socket.on('blocked', function (data) {
        socket.broadcast.emit('blocked', data);
    });
    socket.on('unblock', function (data) {
        socket.broadcast.emit('unblock', data);
    });
    socket.on('updateList', function (data) {
        io.sockets.emit('updateList', data);
    });
});
app.use(express.json());
app.use(session(config_1.Configuration.sessionOptions));
//---- connect to database ----------------------------------------------------
database.connect(function (err) {
    if (err) {
        console.log('Database connection failed: ', err);
    }
    else {
        console.log('Database is connected');
    }
});
/*****************************************************************************
 * STATIC ROUTES                                                             *
 *****************************************************************************/
var basedir = __dirname + '/../..'; // get rid of /server/src
/*app.use('/', express.static(basedir + '/client/views'));
app.use('/css', express.static(basedir + '/client/css'));
app.use('/src', express.static(basedir + '/client/src'));
app.use('/jquery', express.static(basedir + '/client/node_modules/jquery/dist'));
app.use('/popperjs', express.static(basedir + '/client/node_modules/popper.js/dist'));
app.use('/bootstrap', express.static(basedir + '/client/node_modules/bootstrap/dist'));
app.use('/font-awesome', express.static(basedir + '/client/node_modules/font-awesome'));*/
/*****************************************************************************
 * Middleware routes for session management (login and authentication)       *
 *****************************************************************************/
/**
 * @apiDefine SessionExpired
 *
 * @apiError (Client Error) {401} SessionNotFound The session of the user is expired or was not set
 *
 * @apiErrorExample SessionNotFound:
 * HTTP/1.1 401 Unauthorized
 * {
 *     "message":"Session expired, please log in again."
 * }
 */
function isLoggedIn() {
    // Abstract middleware route for checking login state of the user
    return function (req, res, next) {
        if (req.session.user) {
            // User has an active session and is logged in, continue with route
            next();
        }
        else {
            // User is not logged in
            res.status(401).send({
                message: 'Session expired, please log in again',
            });
        }
    };
}
/**
 * @apiDefine NotAuthorized
 *
 * @apiError (Client Error) {403} NotAuthorized The user trying to create a new user is not logged in
 *
 * @apiErrorExample NotAuthorized:
 * HTTP/1.1 403 Forbidden
 * {
 *     "message":"Cannot create user since you have insufficient rights"
 * }
 */
function isPrivilegedAtLeast(rights) {
    // Abstract middleware route for checking privilege of the user
    return function (req, res, next) {
        if (rights > Number(req.session.user.rights)) {
            // User is not privileged, reject request
            res.status(403).send({
                message: 'You are not allowed to execute this action',
            });
        }
        else {
            // User is privileged, continue with route
            next();
        }
    };
}
/*****************************************************************************
 * HTTP ROUTES: LOGIN                                                        *
 *****************************************************************************/
/**
 * @api {get} /login Request login state
 * @apiName GetLogin
 * @apiGroup Login
 * @apiVersion 2.0.0
 *
 * @apiSuccess {User} user The user object
 * @apiSuccess {string} message Message stating that the user is still logged in
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "user":{
 *         "id":1,
 *         "username":"admin",
 *         "firstName":"Peter",
 *         "lastName":"Kneisel",
 *         "creationTime":"2017-11-12T09:33:25.000Z",
 *         "rights":"2"
 *      },
 *      "message":"User still logged in"
 *  }
 *
 * @apiError (Client Error) {401} SessionNotFound The session of the user is expired or was not set
 *
 * @apiErrorExample SessionNotFound:
 * HTTP/1.1 401 Unauthorized
 * {
 *     "message":"Session expired, please log in again."
 * }
 */
app.get('/login', isLoggedIn(), function (req, res) {
    res.status(200).send({
        message: 'User still logged in',
        user: req.session.user, // Send user object to client for greeting message
    });
});
/**
 * @api {post} /login Send login request
 * @apiName PostLogin
 * @apiGroup Login
 * @apiVersion 2.0.0
 *
 * @apiParam {string} username Username of the user to log in
 * @apiParam {string} password Password of the user to log in
 *
 * @apiSuccess {User} user The user object
 * @apiSuccess {string} message Message stating the user logged in successfully
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "user":{
 *         "id":1,
 *         "username":"admin",
 *         "firstName":"Peter",
 *         "lastName":"Kneisel",
 *         "creationTime":"2017-11-12T09:33:25.000Z",
 *         "rights":"2"
 *     },
 *     "message":"Successfully logged in"
 * }
 *
 * @apiError (Client Error) {401} LoginIncorrect The login data provided is not correct.
 * @apiError (Server Error) {500} DatabaseRequestFailed The request to the database failed.
 *
 * @apiErrorExample LoginIncorrect:
 * HTTP/1.1 401 Unauthorized
 * {
 *     "message":"Username or password is incorrect."
 * }
 *
 *
 * @apiErrorExample DatabaseRequestFailed:
 * HTTP/1.1 500 Internal Server Errror
 * {
 *     "message":"Database request failed: ..."
 * }
 */
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, data, query, rows, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                username = req.body.username;
                password = req.body.password;
                data = [username, cryptoJS.SHA512(password).toString()];
                query = 'SELECT * FROM userlist WHERE username = ? AND password = ?;';
                return [4 /*yield*/, ownQuery(query, data)];
            case 1:
                rows = _a.sent();
                if (rows.length === 1) {
                    user = new user_1.User(rows[0].id, rows[0].username, rows[0].firstName, rows[0].lastName, new Date(rows[0].time), rows[0].rights, rows[0].description);
                    req.session.user = user; // Store user object in session for authentication
                    res.status(200).send({
                        message: 'Successfully logged in',
                        user: user,
                    });
                }
                else {
                    // Login data is incorrect, user is not logged in
                    res.status(401).send({
                        message: 'Username or password is incorrect.',
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                // Login data is incorrect, user is not logged in
                res.status(500).send({
                    message: 'Database request failed: ' + error_1,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @api {post} /logout Logout user
 * @apiName PostLogout
 * @apiGroup Logout
 * @apiVersion 2.0.0
 *
 * @apiSuccess {string} message Message stating that the user is logged out
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     message: "Successfully logged out"
 * }
 */
app.post('/logout', function (req, res) {
    // Log out user
    delete req.session.user; // Delete user from session
    res.status(200).send({
        message: 'Successfully logged out',
    });
});
/*****************************************************************************
 * HTTP ROUTES: USER, USERS                                                  *
 *****************************************************************************/
/**
 * @api {post} /user Create a new user
 * @apiName postUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiUse SessionExpired
 * @apiUse NotAuthorized
 *
 * @apiParam {string} firstName First name of the user
 * @apiParam {string} lastName Last name of the user
 *
 * @apiSuccess {string} message Message stating the new user has been created successfully
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Successfully created new user"
 * }
 *
 * @apiError (Client Error) {400} NotAllMandatoryFields The request did not contain all mandatory fields
 *
 * @apiErrorExample NotAllMandatoryFields:
 * HTTP/1.1 400 Bad Request
 * {
 *     "message":"Not all mandatory fields are filled in"
 * }
 */
app.post('/user', isLoggedIn(), isPrivilegedAtLeast(rights_1.Rights.Admin), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstName, lastName, username, password, description, data, query, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                firstName = req.body.firstName;
                lastName = req.body.lastName;
                username = req.body.username;
                password = cryptoJS.SHA512(req.body.password).toString();
                description = req.body.description;
                if (!(firstName && lastName)) return [3 /*break*/, 2];
                data = [
                    new Date().toLocaleString(),
                    username,
                    password,
                    firstName,
                    lastName,
                    rights_1.Rights.User,
                    description
                ];
                query = 'INSERT INTO userlist (creationTime, username, password, firstName, lastName, rights, description) VALUES (?, ?, ?, ?, ?, ?, ?);';
                return [4 /*yield*/, ownQuery(query, data)];
            case 1:
                result = _a.sent();
                if (result === null) {
                    res.status(400).send({
                        message: 'An error occured while creating the new user',
                    });
                }
                else {
                    res.status(201).send({
                        message: 'Successfully created new user',
                    });
                    io.sockets.emit('updateList');
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send({
                    message: 'Not all mandatory fields are filled in',
                });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(400).send({
                    message: 'An error occured while creating the new user',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @api {get} /user:userId Get user with given id
 * @apiName getUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiUse SessionExpired
 *
 * @apiParam {number} userId The id of the requested user
 *
 * @apiSuccess {User} user The requested user object
 * @apiSuccess {string} message Message stating the user has been found
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "user":{
 *         "id":1,
 *         "firstName":"Peter",
 *         "lastName":"Kneisel",
 *         "creationTime":"2018-10-21 14:19:12"
 *     },
 *     "message":"Successfully got user"
 * }
 *
 *  @apiError (Client Error) {404} NotFound The requested user can not be found
 *
 * @apiErrorExample NotFound:
 * HTTP/1.1 404 Not Found
 * {
 *     "message":"The requested user can not be found."
 * }
 */
app.get('/user/:userId', isLoggedIn(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, query, rows, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = Number(req.params.userId);
                query = 'SELECT * FROM userlist WHERE id = ?;';
                return [4 /*yield*/, ownQuery(query, [userId])];
            case 1:
                rows = _a.sent();
                if (rows.length === 1) {
                    user = new user_1.User(rows[0].id, rows[0].username, rows[0].firstName, rows[0].lastName, new Date(rows[0].creationTime), rows[0].rights, rows[0].description);
                    // Send user list to client
                    res.status(200).send({
                        user: user,
                        message: 'Successfully got user',
                    });
                }
                else {
                    res.status(404).send({
                        message: 'The requested user can not be found.',
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                // Database operation has failed
                res.status(500).send({
                    message: 'Database request failed: ' + error_3
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @api {put} /user/:userId Update user with given id
 * @apiName putUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiUse SessionExpired
 * @apiUse NotAuthorized
 *
 * @apiParam {number} userId The id of the requested user
 * @apiParam {string} firstName The (new) first name of the user
 * @apiParam {string} lastName The (new) last name of the user
 *
 * @apiSuccess {string} message Message stating the user has been updated
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Successfully updated user ..."
 * }
 *
 * @apiError (Client Error) {400} NotAllMandatoryFields The request did not contain all mandatory fields
 * @apiError (Client Error) {404} NotFound The requested user can not be found
 *
 * @apiErrorExample NotAllMandatoryFields:
 * HTTP/1.1 400 Bad Request
 * {
 *     "message":"Not all mandatory fields are filled in"
 * }
 *
 * @apiErrorExample NotFound:
 * HTTP/1.1 404 Not Found
 * {
 *     "message":"The user to update could not be found"
 * }
 */
app.put('/user/:userId', isLoggedIn(), isPrivilegedAtLeast(rights_1.Rights.Admin), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, firstName, lastName, data, query, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = Number(req.params.userId);
                firstName = req.body.firstName;
                lastName = req.body.lastName;
                if (!(firstName && lastName)) return [3 /*break*/, 2];
                data = [firstName, lastName, userId];
                query = 'UPDATE userlist SET firstName = ?, lastName = ? WHERE id = ?;';
                return [4 /*yield*/, ownQuery(query, data)];
            case 1:
                result = _a.sent();
                res.status(200).send({
                    message: "Successfully updated user " + firstName + " " + lastName,
                });
                io.sockets.emit('updateList');
                if (result.affectedRows != 1) {
                    res.status(400).send({
                        message: 'The user to update could not be found',
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(400).send({
                    message: 'Not all mandatory fields are filled in',
                });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                res.status(400).send({
                    message: 'The user to update could not be found',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @api {delete} /user/:userId Delete user with given id
 * @apiName deleteUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiUse SessionExpired
 * @apiUse NotAuthorized
 *
 * @apiParam {number} userId The id of the requested user
 *
 * @apiSuccess {string} message Message stating the user has been updated
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Successfully deleted user ..."
 * }
 */
app.delete('/user/:userId', isLoggedIn(), isPrivilegedAtLeast(rights_1.Rights.Admin), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, query, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = Number(req.params.userId);
                query = 'DELETE FROM userlist WHERE id = ?;';
                return [4 /*yield*/, ownQuery(query, [userId])];
            case 1:
                result = _a.sent();
                if (result.affectedRows === 1) {
                    res.status(200).send({
                        message: 'Successfully deleted user',
                    });
                    io.sockets.emit('updateList');
                }
                else {
                    res.status(400).send({
                        message: 'The user to be deleted could not be found',
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).send({
                    message: 'Database request failed: ' + error_5
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @api {get} /users Get all users
 * @apiName getUsers
 * @apiGroup Users
 * @apiVersion 2.0.0
 *
 * @apiUse SessionExpired
 *
 * @apiSuccess {User[]} userList The list of all users
 * @apiSuccess {string} message Message stating the users have been found
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "userList": [
 *      {
 *        "firstName": "Hans",
 *        "lastName": "Mustermann",
 *        "creationTime": "2018-11-04T13:02:44.791Z",
 *        "id": 1
 *     },
 *      {
 *        "firstName": "Bruce",
 *        "lastName": "Wayne",
 *        "creationTime": "2018-11-04T13:03:18.477Z",
 *        "id": 2
 *      }
 *    ]
 *    "message":"Successfully requested user list"
 * }
 */
app.get('/users', isLoggedIn(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, rows, userList, _i, rows_1, row, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = 'SELECT * FROM userlist;';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ownQuery(query, [])];
            case 2:
                rows = _a.sent();
                userList = [];
                // Parse every entry
                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    row = rows_1[_i];
                    userList.push(new user_1.User(row.id, row.username, row.firstName, row.lastName, new Date(row.creationTime), row.rights, row.description));
                }
                res.status(200).send({
                    userList: userList,
                    message: 'Successfully requested user list'
                });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(500).send({
                    message: 'Database request failed: ' + error_6
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//-- Query function
function ownQuery(sql, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.query(sql, data, function (error, result) {
                        if (error) {
                            reject(result);
                        }
                        else {
                            resolve(result);
                        }
                    });
                })];
        });
    });
}
app.use('/', express.static(__dirname + "/../../usermanAng/dist/usermanAng"));
//Musste zwei mal rausgehen, weil der server bei mir in dem Ordner server noch drin lag, also aus versehen eine Struktur zu weit
app.use('/*', express.static(__dirname + "/../../usermanAng/dist/usermanAng"));
//# sourceMappingURL=server.js.map