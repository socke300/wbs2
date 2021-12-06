/*****************************************************************************
 * Import package                                                            *
 *****************************************************************************/
import express = require ('express');
import socket = require('socket.io');
import {Server} from 'socket.io';
import { Request, Response } from 'express';
import { User } from '../model/user';
import {Connection, MysqlError} from "mysql";
import mysql = require ("mysql");
import {Configuration} from "../config/config";      // handles database connections
import session = require ('express-session');
import {Rights} from "../model/rights";
import cryptoJS = require ('crypto-js');

/*****************************************************************************
 * Define and start web-app server, define json-Parser                       *
 *****************************************************************************/
const app = express();
const database: Connection = mysql.createConnection(Configuration.mysqlOptions);

let server = app.listen(8080, () => {
    console.log('Server started: http://localhost:8080');
});

//---- Socket setup & pass server -----------------------------------
let io = new Server(server);
io.on('connection', (socket) => {

    //-- connection and disconnection
    console.log('made socket connection with', socket.id);
    socket.on('disconnect', function(){
        console.log('socket disconnected');
    });

    //-- Handle socket-events
    socket.on('blocked', function(data){
        socket.broadcast.emit('blocked', data);
    });
    socket.on('unblock', function(data){
        socket.broadcast.emit('unblock', data);
    });
    socket.on('updateList', function(data){
        io.sockets.emit('updateList', data);
    });
});

app.use(express.json());
app.use(session(Configuration.sessionOptions));

//---- connect to database ----------------------------------------------------
database.connect((err: MysqlError) => {
    if (err) {
        console.log('Database connection failed: ', err);
    } else {
        console.log('Database is connected');
    }
});


/*****************************************************************************
 * STATIC ROUTES                                                             *
 *****************************************************************************/
const basedir: string = __dirname + '/../..';  // get rid of /server/src
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
app.get('/login', isLoggedIn(), (req: Request, res: Response) => {
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

app.post('/login', async (req: Request, res: Response) => {
    // Read data from request
    try {
        const username: string = req.body.username;
        const password: string = req.body.password;

        // Create database query and data
        const data: [string, string] = [username, cryptoJS.SHA512(password).toString()];
        const query: string = 'SELECT * FROM userlist WHERE username = ? AND password = ?;';

        let rows = await ownQuery(query, data);

        if (rows.length === 1) {
            // Login data is correct, user is logged in
            const user: User = new User(rows[0].id,
                rows[0].username,
                rows[0].firstName,
                rows[0].lastName,
                new Date(rows[0].time),
                rows[0].rights,
                rows[0].description);
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
    } catch (error){
        // Login data is incorrect, user is not logged in
        res.status(500).send({
            message: 'Database request failed: ' + error,
        });
    }
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
app.post('/logout', (req: Request, res: Response) => {
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

app.post('/user', isLoggedIn(), isPrivilegedAtLeast(Rights.Admin), async (req: Request, res: Response) => {
    // Read data from request body
    try{
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const username: string = req.body.username;
        const password: string = cryptoJS.SHA512(req.body.password).toString();
        const description: string = req.body.description;

        if (firstName && lastName) {
            // Create new user
            // Create database query and data
            const data: [string, string, string, string, string, Rights, string] = [
                new Date().toLocaleString(),
                username,
                password,
                firstName,
                lastName,
                Rights.User,
                description]; // As standard, any new user has rights Rights.User
            const query: string = 'INSERT INTO userlist (creationTime, username, password, firstName, lastName, rights, description) VALUES (?, ?, ?, ?, ?, ?, ?);';
            // Execute database query
            let result = await ownQuery(query, data);
            if(result === null){
                res.status(400).send({
                    message: 'An error occured while creating the new user',
                });
            } else {
                res.status(201).send({
                    message: 'Successfully created new user',
                });
                io.sockets.emit('updateList');
            }
        } else{
            res.status(400).send({
                message: 'Not all mandatory fields are filled in',
            });
        }
    } catch(error){
        res.status(400).send({
            message: 'An error occured while creating the new user',
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

app.get('/user/:userId', isLoggedIn(), async (req: Request, res: Response) => {
    // Read data from request parameters
    try{
        const userId: number = Number(req.params.userId);
        let query: string = 'SELECT * FROM userlist WHERE id = ?;';

        let rows = await ownQuery(query, [userId]);

        if (rows.length === 1) {
            let user: User = new User(
                rows[0].id,
                rows[0].username,
                rows[0].firstName,
                rows[0].lastName,
                new Date(rows[0].creationTime),
                rows[0].rights,
                rows[0].description
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
    } catch(error){
        // Database operation has failed
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    }
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

app.put('/user/:userId', isLoggedIn(), isPrivilegedAtLeast(Rights.Admin), async (req: Request, res: Response) => {
    // Read data from request
    try{
        const userId: number = Number(req.params.userId);
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;

        if (firstName && lastName) {
            // Create database query and data
            let data: [string, string, number] = [firstName, lastName, userId];
            let query: string = 'UPDATE userlist SET firstName = ?, lastName = ? WHERE id = ?;';

            let result = await ownQuery(query, data);
            res.status(200).send({
                message: `Successfully updated user ${firstName} ${lastName}`,
            });
            io.sockets.emit('updateList');
            if(result.affectedRows != 1){
                res.status(400).send({
                    message: 'The user to update could not be found',
                });
            }
        } else{
            res.status(400).send({
                message: 'Not all mandatory fields are filled in',
            });
        }
    }catch(error){
        res.status(400).send({
            message: 'The user to update could not be found',
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

app.delete('/user/:userId', isLoggedIn(), isPrivilegedAtLeast(Rights.Admin), async (req: Request, res: Response) => {
    // Read data from request
    try{
        const userId: number = Number(req.params.userId);
        let query: string = 'DELETE FROM userlist WHERE id = ?;';
        let result = await ownQuery(query, [userId]);
        if(result.affectedRows === 1){
            res.status(200).send({
                message: 'Successfully deleted user',
            });
            io.sockets.emit('updateList');
        } else{
            res.status(400).send({
                message: 'The user to be deleted could not be found',
            });
        }
    } catch(error){
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    }
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

app.get('/users', isLoggedIn(), async (req: Request, res: Response) => {
    let query: string = 'SELECT * FROM userlist;';
    try {
        let rows = await ownQuery(query, []);
        const userList: User[] = [];
        // Parse every entry
        for (const row of rows) {
            userList.push(new User(
                row.id,
                row.username,
                row.firstName,
                row.lastName,
                new Date(row.creationTime),
                row.rights,
                row.description
            ));
        }
        res.status(200).send({
            userList: userList,
            message: 'Successfully requested user list'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Database request failed: ' + error
        });
    }
});


//-- Query function

async function ownQuery(sql: string, data: any[]): Promise<any> {   //Zur Unterscheidung wurde die Funktion aus Aufgabe 2.2 Übung 1 in OwnQuery unbenannt
    return new Promise((resolve , reject) => {
        database.query(sql, data,(error:MysqlError, result: any) => {
            if(error){
                reject(result);
            }else{
                resolve(result);
            }
        });
    });
}

app.use('/', express.static(`${__dirname}/../../usermanAng/dist/usermanAng`));
//Musste zwei mal rausgehen, weil der server bei mir in dem Ordner server noch drin lag, also aus versehen eine Struktur zu weit
app.use('/*', express.static(`${__dirname}/../../usermanAng/dist/usermanAng`));