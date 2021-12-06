"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var ToDoEntry_1 = require("../src/app/Model/ToDoEntry");
var todoList;
todoList = [
    new ToDoEntry_1.ToDoEntry('Milch'),
    new ToDoEntry_1.ToDoEntry('Butter'),
    new ToDoEntry_1.ToDoEntry('Brot')
];
var router = express();
router.use(bodyParser.json());
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
router.post('/entry', function (req, res) {
    var title = (req.body.title ? req.body.title : '');
    var message = '';
    if (title.trim().length !== 0) {
        todoList.push(new ToDoEntry_1.ToDoEntry(title));
        message = title + " erfolgreich hinzugef\u00FCgt";
        res.status(201);
    }
    else {
        res.status(400);
        message = 'Keinen title angegeben';
    }
    res.send({ 'message': message });
});
router["delete"]('/entry/:id', function (req, res) {
    var id = req.params.id;
    var message = '';
    if (!isNaN(id) && id >= 0 && id < todoList.length && todoList[id] != null) {
        message = todoList[id].title + " wurde gel\u00F6scht.";
        todoList.splice(id, 1);
        res.status(200);
    }
    else if (isNaN(id)) {
        message = 'ID \'' + id + '\' ist keine Zahl';
        res.status(400);
    }
    else if (id < 0 || id >= todoList.length) {
        message = 'ID ' + id + ' ist außerhalb des gültigen Bereichs';
        res.status(404);
    }
    else {
        message = 'Entry mit ID ' + id + ' wurde gelöscht';
        res.status(410);
    }
    res.json({ 'message': message });
});
router.put('/done/:id', function (req, res) {
    var id = req.params.id;
    var message = '';
    if (!isNaN(id) && id >= 0 && id < todoList.length && todoList[id] != null) {
        message = todoList[id].title + " wurde als erledigt markiert.";
        todoList[id].done = true;
        res.status(200);
    }
    else if (isNaN(id)) {
        message = 'ID \'' + id + '\' ist keine Zahl';
        res.status(400);
    }
    else if (id < 0 || id >= todoList.length) {
        message = 'ID ' + id + ' ist außerhalb des gültigen Bereichs';
        res.status(404);
    }
    else {
        message = 'Entry mit ID ' + id + ' wurde zuvor gelöscht';
        res.status(410);
    }
    res.json({ 'message': message });
});
router.put('/undone/:id', function (req, res) {
    var id = req.params.id;
    var message = '';
    if (!isNaN(id) && id >= 0 && id < todoList.length && todoList[id] != null) {
        message = todoList[id].title + " wurde als nicht erledigt markiert.";
        todoList[id].done = false;
        res.status(200);
    }
    else if (isNaN(id)) {
        message = 'ID \'' + id + '\' ist keine Zahl';
        res.status(400);
    }
    else if (id < 0 || id >= todoList.length) {
        message = 'ID ' + id + ' ist außerhalb des gültigen Bereichs';
        res.status(404);
    }
    else {
        message = 'Entry mit ID ' + id + ' wurde zuvor gelöscht';
        res.status(410);
    }
    res.json({ 'message': message });
});
router.get('/todolist', function (req, res) {
    var message;
    message = todoList.length + ' ToDos wurden gefunden asds';
    res.status(200);
    res.json({
        'message': message,
        'todoList': todoList
    });
});
router.use('/', express.static(__dirname + "/../dist/Angular1"));
router.use('/*', express.static(__dirname + "/../dist/Angular1"));
router.listen(8080, 'localhost', function () {
    console.log('');
    console.log('-------------------------------------------------------------');
    console.log('                    ToDo-Backend läuft                       ');
    console.log('-------------------------------------------------------------');
    console.log('       Liste abrufen:     http://localhost:8080/todolist     ');
    console.log('       Frontend aufrufen: http://localhost:8080              ');
    console.log('-------------------------------------------------------------');
});
//# sourceMappingURL=todoserver.js.map