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
var user_1 = require("../model/user");
var mysql = require("mysql");
var config_1 = require("../config/config"); // handles database connections
var session = require("express-session");
var rights_1 = require("../model/rights");
var cryptoJS = require("crypto-js");
var socket_io_1 = require("socket.io");
/*****************************************************************************
 * Define and start web-app server, define json-Parser                       *
 *****************************************************************************/
var app = express();
var database = mysql.createConnection(config_1.Configuration.mysqlOptions);
var writeProtectUsers = [];
var server = app.listen(8080, function () {
    console.log('[' + new Date() + '] Server started: http://localhost:8080');
});
var io = new socket_io_1.Server(server);
app.use(express.json());
app.use(session(config_1.Configuration.sessionOptions));
//---- connect to database ----------------------------------------------------
database.connect(function (err) {
    if (err) {
        console.log('[' + new Date() + '] Database connection failed: ', err);
    }
    else {
        console.log('[' + new Date() + '] Database is connected');
    }
});
/*****************************************************************************
 * SOCKET CONNECTION                                                         *
 *****************************************************************************/
io.on('connection', (function (socket) {
    // Handle connection and disconnection
    console.log('[' + new Date() + '] Made socket connection with: ', socket.id);
    socket.on('disconnect', function (user) {
        for (var _i = 0, writeProtectUsers_1 = writeProtectUsers; _i < writeProtectUsers_1.length; _i++) {
            var entry = writeProtectUsers_1[_i];
            if (entry.user === user) {
                writeProtectUsers.splice(writeProtectUsers.indexOf(entry), 1);
                io.sockets.emit('unblock');
            }
        }
    });
    //Handle socket events
    socket.on('block', function (data) {
        writeProtectUsers.push({ subject: data, user: socket.id });
        io.sockets.emit('block');
    });
    socket.on('unblock', function (data) {
        writeProtectUsers.splice(writeProtectUsers.indexOf({ subject: data, user: socket.id }), 1);
        io.sockets.emit('unblock');
    });
    socket.on('add', function (data) {
        io.sockets.emit('add', data);
    });
    socket.on('delete', function (data) {
        io.sockets.emit('delete', data);
    });
    socket.on('edit', function (data) {
        io.sockets.emit('edit', data);
    });
}));
/*****************************************************************************
 * STATIC ROUTES                                                             *
 *****************************************************************************/
var basedir = __dirname + '/../..'; // get rid of /server/src
app.use('/', express.static(basedir + '/client/dist/client'));
app.use('/user/*', express.static(basedir + '/client/dist/client'));
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
function getBlockedStatus(userId) {
    for (var _i = 0, writeProtectUsers_2 = writeProtectUsers; _i < writeProtectUsers_2.length; _i++) {
        var entry = writeProtectUsers_2[_i];
        if (entry.subject === userId) {
            return true;
        }
    }
    return false;
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
app.get('/api/login', isLoggedIn(), function (req, res) {
    console.log('[' + new Date() + '] Got request: GET /login');
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
app.post('/api/login', function (req, res) {
    console.log('[' + new Date() + '] Got request: POST /login: ' + req.body.username + '\n');
    // Read data from request
    var username = req.body.username;
    var password = req.body.password;
    // Create database query and data
    var data = [username, cryptoJS.SHA512(password).toString()];
    var sql = 'SELECT * FROM userlist WHERE username = ? AND password = ?;';
    // request user from database
    query(sql, data).then(function (rows) {
        // Check if database response contains exactly one entry
        if (rows.length === 1) {
            // Login data is correct, user is logged in
            var user = new user_1.User(rows[0].id, rows[0].username, rows[0].firstName, rows[0].lastName, new Date(rows[0].time), rows[0].rights);
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
    }).catch(function (err) {
        // Login data is incorrect, user is not logged in
        res.status(500).send({
            message: 'Database request failed: ' + err,
        });
    });
});
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
app.post('/api/logout', function (req, res) {
    console.log('[' + new Date() + '] Got request: POST /logout \n');
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
app.post('/api/user', isLoggedIn(), isPrivilegedAtLeast(rights_1.Rights.Admin), function (req, res) {
    console.log('[' + new Date() + '] Got request: POST /user: \n');
    // Read data from request body
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var password = cryptoJS.SHA512(req.body.password).toString();
    // add a new user if first- and lastname exist
    if (firstName && lastName) {
        // Create new user
        // Create database query and data
        var data = [
            new Date().toLocaleString(),
            username,
            password,
            firstName,
            lastName,
            rights_1.Rights.User
        ]; // As standard, any new user has rights Rights.User
        var sql = 'INSERT INTO userlist (creationTime, username, password, firstName, lastName, rights) VALUES (?, ?, ?, ?, ?, ?);';
        // Execute database query
        query(sql, data).then(function (result) {
            if (result === null) {
                // Send response
                res.status(400).send({
                    message: 'An error occured while creating the new user',
                });
            }
            else {
                res.status(201).send({
                    message: 'Successfully created new user',
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                message: 'An error occured while creating the new user',
            });
        });
    }
    else {
        res.status(400).send({
            message: 'Not all mandatory fields are filled in',
        });
    }
});
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
app.get('/api/user/:userId', isLoggedIn(), function (req, res) {
    // Read data from request parameters
    var userId = Number(req.params.userId);
    console.log('[' + new Date() + '] Got request: GET /user/' + userId + '\n');
    var sql = 'SELECT * FROM userlist WHERE id = ?;';
    query(sql, [userId]).then(function (rows) {
        if (rows.length === 1) {
            var user = new user_1.User(rows[0].id, rows[0].username, rows[0].firstName, rows[0].lastName, new Date(rows[0].creationTime), rows[0].rights);
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
    }).catch(function (error) {
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    });
});
app.get('/api/user/status/:userId', isLoggedIn(), function (req, res) {
    var userId = Number(req.params.userId);
    console.log('[' + new Date() + '] Got request: GET /user/status/' + userId + '\n');
    res.status(200).send({
        status: getBlockedStatus(userId),
        message: 'Successfully got user stats',
    });
});
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
app.put('/api/user/:userId', isLoggedIn(), isPrivilegedAtLeast(rights_1.Rights.Admin), function (req, res) {
    // Read data from request
    var userId = Number(req.params.userId);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    console.log('[' + new Date() + '] Got request: PUT /user/' + userId + '\n');
    // Check that all arguments are given
    if (firstName && lastName) {
        // Create database query and data
        var data = [firstName, lastName, userId];
        var sql = 'UPDATE userlist SET firstName = ?, lastName = ? WHERE id = ?;';
        // Execute database query
        query(sql, data).then(function (result) {
            if (result.affectedRows != 1) {
                res.status(400).send({
                    message: 'The user to update could not be found',
                });
            }
            else {
                res.status(200).send({
                    message: "Successfully updated user " + firstName + " " + lastName,
                });
            }
        });
    }
});
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
app.delete('/api/user/:userId', isLoggedIn(), isPrivilegedAtLeast(rights_1.Rights.Admin), function (req, res) {
    // Read data from request
    var userId = Number(req.params.userId);
    console.log('[' + new Date() + '] Got request: DELETE /user/' + userId + '\n');
    var sql = 'DELETE FROM userlist WHERE id = ?;';
    query(sql, [userId]).then(function (result) {
        if (result.affectedRows === 1) {
            res.status(200).send({
                message: 'Successfully deleted user',
            });
        }
        else {
            res.status(400).send({
                message: 'The user to be deleted could not be found',
            });
        }
    }).catch(function (error) {
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    });
});
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
app.get('/api/users', isLoggedIn(), function (req, res) {
    var sql = 'SELECT * FROM userlist;';
    console.log('[' + new Date() + '] Got request: GET /users \n');
    query(sql).then(function (rows) {
        // Create local user list to parse users from database
        var userList = [];
        // Parse every entry
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            userList.push(new user_1.User(row.id, row.username, row.firstName, row.lastName, new Date(row.creationTime), row.rights));
        }
        res.status(200).send({
            userList: userList,
            message: 'Successfully requested user list'
        });
    }).catch(function (error) {
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    });
});
/*****************************************************************************
 * DATABASE QUERY                                                            *
 *****************************************************************************/
function query(sql, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.query(sql, data, (function (err, results) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    }));
                })];
        });
    });
}
//# sourceMappingURL=server.js.map