/*****************************************************************************
 * Import package                                                            *
 *****************************************************************************/
import express = require ('express');
import { Request, Response } from 'express';
import { User } from '../model/user';
import {Connection, MysqlError} from "mysql";
import mysql = require ("mysql");
import {Configuration} from "../config/config";      // handles database connections
import session = require ('express-session');
import {Rights} from "../model/rights";
import cryptoJS = require ('crypto-js');
import {Server} from 'socket.io';

/*****************************************************************************
 * Define and start web-app server, define json-Parser                       *
 *****************************************************************************/
const app = express();
const database: Connection = mysql.createConnection(Configuration.mysqlOptions);
const writeProtectUsers: {subject: number, user: string}[] = [];

const server = app.listen(8080, () => {
    console.log('[' + new Date() + '] Server started: http://localhost:8080');
});

const io = new Server(server);

app.use(express.json());
app.use(session(Configuration.sessionOptions));

//---- connect to database ----------------------------------------------------
database.connect((err: MysqlError) => {
    if (err) {
        console.log('[' + new Date() + '] Database connection failed: ', err);
    } else {
        console.log('[' + new Date() + '] Database is connected');
    }
});

/*****************************************************************************
 * SOCKET CONNECTION                                                         *
 *****************************************************************************/
io.on('connection', (socket => {

    // Handle connection and disconnection
    console.log('[' + new Date() + '] Made socket connection with: ', socket.id);
    socket.on('disconnect', function (user){
        console.log('[' + new Date() + '] Disconnect socket connection with: ', socket.id);
        for(let entry of writeProtectUsers) {
            if (entry.user === socket.id){
                writeProtectUsers.splice(writeProtectUsers.indexOf(entry),1);
                io.sockets.emit('unblock');
            }
        }
    });

    //Handle socket events
    socket.on('block', function (data){
        console.log('[' + new Date() + '] Got socket event from + ' + socket.id + ': block');
        writeProtectUsers.push({subject: data, user: socket.id});
        io.sockets.emit('block');
    });
    socket.on('unblock', function (data){
        console.log('[' + new Date() + '] Got socket event from + ' + socket.id + ': unblock');
        writeProtectUsers.splice(writeProtectUsers.indexOf({subject: data, user: socket.id}), 1);
        io.sockets.emit('unblock');
    })
    socket.on('add', function (data){
        console.log('[' + new Date() + '] Got socket event from + ' + socket.id + ': add', data);
        io.sockets.emit('add', data);
    })
    socket.on('delete', function (data){
        console.log('[' + new Date() + '] Got socket event from + ' + socket.id + ': delete', data);
        io.sockets.emit('delete', data);
    })
    socket.on('edit', function (data){
        console.log('[' + new Date() + '] Got socket event from + ' + socket.id + ': edit', data);
        io.sockets.emit('edit', data);
    })
}))


/*****************************************************************************
 * STATIC ROUTES                                                             *
 *****************************************************************************/
const basedir: string = __dirname + '/../..';  // get rid of /server/src
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
    return (req: Request, res: Response, next) => {
        if (req.session.user) {
            // User has an active session and is logged in, continue with route
            next();
        } else {
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
function isPrivilegedAtLeast(rights: Rights) {
    // Abstract middleware route for checking privilege of the user
    return (req: Request, res: Response, next) => {
        if (rights > Number(req.session.user.rights)) {
            // User is not privileged, reject request
            res.status(403).send({
                message: 'You are not allowed to execute this action',
            });
        } else {
            // User is privileged, continue with route
            next();
        }
    };
}

function getBlockedStatus(userId: number) {
    for (let entry of writeProtectUsers){
        if (entry.subject === userId){
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
app.get('/api/login', isLoggedIn(), (req: Request, res: Response) => {
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
app.post('/api/login', (req: Request, res: Response) => {
    console.log('[' + new Date() + '] Got request: POST /login: ' + req.body.username + '\n');
    // Read data from request
    const username: string = req.body.username;
    const password: string = req.body.password;

    // Create database query and data
    const data: [string, string] = [username, cryptoJS.SHA512(password).toString()];
    const sql: string = 'SELECT * FROM userlist WHERE username = ? AND password = ?;';

    // request user from database
    query(sql, data).then((rows) => {
        // Check if database response contains exactly one entry
        if (rows.length === 1) {
            // Login data is correct, user is logged in
            const user: User = new User(rows[0].id,
                rows[0].username,
                rows[0].firstName,
                rows[0].lastName,
                new Date(rows[0].time),
                rows[0].rights);
            req.session.user = user; // Store user object in session for authentication
            res.status(200).send({
                message: 'Successfully logged in',
                user, // Send user object to client for greeting message
            });
        } else {
            // Login data is incorrect, user is not logged in
            res.status(401).send({
                message: 'Username or password is incorrect.',
            });
        }
    }).catch((err) => {
        // Login data is incorrect, user is not logged in
        res.status(500).send({
            message: 'Database request failed: ' + err,
        });
    })
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
app.post('/api/logout', (req: Request, res: Response) => {
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
app.post('/api/user', isLoggedIn(), isPrivilegedAtLeast(Rights.Admin), (req: Request, res: Response) => {
    console.log('[' + new Date() + '] Got request: POST /user: \n');
    // Read data from request body
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    const username: string = req.body.username;
    const password: string = cryptoJS.SHA512(req.body.password).toString();

    // add a new user if first- and lastname exist
    if (firstName && lastName) {
        // Create new user
        // Create database query and data
        const data: [string, string, string, string, string, Rights] = [
            new Date().toLocaleString(),
            username,
            password,
            firstName,
            lastName,
            Rights.User]; // As standard, any new user has rights Rights.User
        const sql: string = 'INSERT INTO userlist (creationTime, username, password, firstName, lastName, rights) VALUES (?, ?, ?, ?, ?, ?);';
        // Execute database query
        query(sql, data).then((result) => {
            if (result === null) {
                // Send response
                res.status(400).send({
                    message: 'An error occured while creating the new user',
                });
            } else {
                res.status(201).send({
                    message: 'Successfully created new user',
                });
            }
        }).catch((err) => {
            res.status(400).send({
                message: 'An error occured while creating the new user',
            });
        })
    } else {
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
app.get('/api/user/:userId', isLoggedIn(), (req: Request, res: Response) => {
    // Read data from request parameters
    const userId: number = Number(req.params.userId);
    console.log('[' + new Date() + '] Got request: GET /user/' + userId + '\n');
    let sql: string = 'SELECT * FROM userlist WHERE id = ?;';
    query(sql, [userId]).then((rows) => {
        if (rows.length === 1) {
            let user: User = new User(
                rows[0].id,
                rows[0].username,
                rows[0].firstName,
                rows[0].lastName,
                new Date(rows[0].creationTime),
                rows[0].rights
            );
            // Send user list to client
            res.status(200).send({
                user,
                message: 'Successfully got user',
            });
        } else {
            res.status(404).send({
                message: 'The requested user can not be found.',
            });
        }
    }).catch((error) => {
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    })
});

app.get('/api/user/status/:userId', isLoggedIn(), (req: Request, res: Response) => {
    const userId: number = Number(req.params.userId);
    console.log('[' + new Date() + '] Got request: GET /user/status/' + userId + '\n');
    res.status(200).send({
        status: getBlockedStatus(userId),
        message: 'Successfully got user stats',
    });
})

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
app.put('/api/user/:userId', isLoggedIn(), isPrivilegedAtLeast(Rights.Admin), (req: Request, res: Response) => {
    // Read data from request
    const userId: number = Number(req.params.userId);
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    console.log('[' + new Date() + '] Got request: PUT /user/' + userId + '\n');

    // Check that all arguments are given
    if (firstName && lastName) {

        // Create database query and data
        let data: [string, string, number] = [firstName, lastName, userId];
        let sql: string = 'UPDATE userlist SET firstName = ?, lastName = ? WHERE id = ?;';

        // Execute database query
        query(sql, data).then((result) => {
            if (result.affectedRows != 1) {
                res.status(400).send({
                    message: 'The user to update could not be found',
                });
            } else {
                res.status(200).send({
                    message: `Successfully updated user ${firstName} ${lastName}`,
                });
            }
        })
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
app.delete('/api/user/:userId', isLoggedIn(), isPrivilegedAtLeast(Rights.Admin), (req: Request, res: Response) => {
    // Read data from request
    const userId: number = Number(req.params.userId);
    console.log('[' + new Date() + '] Got request: DELETE /user/' + userId + '\n');
    let sql: string = 'DELETE FROM userlist WHERE id = ?;';

    query(sql, [userId]).then((result) => {
        if (result.affectedRows === 1){
            res.status(200).send({
                message: 'Successfully deleted user',
            });
        } else {
            res.status(400).send({
                message: 'The user to be deleted could not be found',
            });
        }
    }).catch((error) => {
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
app.get('/api/users', isLoggedIn(), (req: Request, res: Response) => {
    let sql: string = 'SELECT * FROM userlist;';
    console.log('[' + new Date() + '] Got request: GET /users \n');

    query(sql).then((rows) => {
        // Create local user list to parse users from database
        const userList: User[] = [];
        // Parse every entry
        for (const row of rows) {
            userList.push(new User(
                row.id,
                row.username,
                row.firstName,
                row.lastName,
                new Date(row.creationTime),
                row.rights
            ));
        }
        res.status(200).send({
            userList: userList,
            message: 'Successfully requested user list'
        });
    }).catch((error) => {
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    })
});

/*****************************************************************************
 * DATABASE QUERY                                                            *
 *****************************************************************************/
async function query(sql: string, data?: any[]): Promise<any>{
    return new Promise((resolve, reject) => {
        database.query(sql, data, ((err, results) => {
            if (err){
                reject(err);
            } else {
                resolve(results);
            }
        }));
    });
}