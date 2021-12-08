/*****************************************************************************
 * interface declaration                                                     *
 *****************************************************************************/
// Enum for different access levels
var Rights;
(function (Rights) {
    Rights[Rights["User"] = 0] = "User";
    // Admin,
    // SuperAdmin,
})(Rights || (Rights = {}));
/*****************************************************************************
 * Socket Connection                                                         *
 *****************************************************************************/
// Establish connection
var socket = io.connect(window.location.protocol + '//' + window.location.host);
// Create socket handlers
socket.on('block', function () {
    getList();
});
socket.on('unblock', function () {
    getList();
});
socket.on('add', function () {
    getList();
});
socket.on('delete', function () {
    getList();
});
// Create DOM event handlers
function emitBlockSignal(userId) {
    socket.emit('block', userId);
}
var currentEditing = -1;
function emitUnblockSignal() {
    if (currentEditing != -1) {
        socket.emit('unblock', currentEditing);
        currentEditing = -1;
    }
}
function emitDeleteSignal() {
    socket.emit('delete');
}
function emitAddSignal() {
    socket.emit('add');
}
/*****************************************************************************
 * Event Handlers (callbacks)                                                *
 *****************************************************************************/
function checkLogin() {
    // Define JQuery HTML objects
    var logoutForm = $('#logout-form');
    var contentArea = $('#content');
    var greeting = $('#navbar-username');
    // Perform ajax request to check if user is logged in
    $.get('/login')
        .then(function (response) {
        // User is logged in
        logoutForm.fadeIn();
        contentArea.fadeIn(); // Show content area
        greeting.text("Hello, " + response.user.username + "!");
        // Get newest user list from server
        updateUserList();
    })
        .catch(function (error) {
        checkErrorResponse(error);
    });
}
function login(event) {
    // Prevent the default behaviour of the browser (reloading the page)
    event.preventDefault();
    // Define JQuery HTML objects
    var usernameField = $('#login-username');
    var passwordField = $('#login-password');
    var contentArea = $('#content');
    var loginForm = $('#login-form');
    var logoutForm = $('#logout-form');
    var greetingName = $('#navbar-username');
    // Read values from input fields
    var username = usernameField.val().toString().trim();
    var password = passwordField.val().toString().trim();
    // Check if all required fields are filled in
    if (username && password) {
        // Perform ajax request to log user in
        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                password: password,
                username: username
            }),
            contentType: 'application/json'
        })
            .then(function (response) {
            // User is logged in
            loginForm.trigger('reset');
            loginForm.fadeOut(function () {
                logoutForm.fadeIn();
            });
            greetingName.text("Hello, " + response.user.username + "!");
            contentArea.fadeIn();
            // Get local user list
            updateUserList();
        })
            .catch(function (error) {
            checkErrorResponse(error);
        });
    }
    else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }
}
function logout() {
    // Define JQuery HTML objects
    var loginForm = $('#login-form');
    var logoutForm = $('#logout-form');
    var contentArea = $('#content');
    var userListArea = $('#user-table');
    // Perform ajax request to log out user
    $.post('/logout')
        .then(function () {
        // User is logged out
        logoutForm.fadeOut(function () {
            loginForm.fadeIn();
        });
        contentArea.fadeOut(); // Hide content area since user is not permitted to see
        userListArea.empty(); // Empty user list since it contains sensitive data
    })
        .catch(function (error) {
        // User is still logged in
        loginForm.fadeOut();
        logoutForm.fadeIn();
        checkErrorResponse(error);
    });
}
function updateUserList() {
    // Perform ajax request to update local user list
    $.get('/users')
        .then(function (response) {
        // User is logged in
        renderUserList(response.userList);
    })
        .catch(function (error) {
        checkErrorResponse(error);
    });
}
/*****************************************************************************
 * Helper functions                                                          *
 *****************************************************************************/
var blockedUsers = [];
function checkErrorResponse(error) {
    var logoutForm = $('#logout-form');
    var loginForm = $('#login-form');
    var contentArea = $('#content');
    var userListArea = $('#user-table-body');
    renderMessage(error.responseJSON.message);
    if (error.status === 401) {
        logoutForm.fadeOut(function () { return loginForm.fadeIn(); });
        contentArea.fadeOut(); // Hide content area since user is not permitted to see
        userListArea.empty(); // Empty user list since it contains sensitive data
    }
}
/*****************************************************************************
 * Event Handlers (callbacks)                                                *
 *****************************************************************************/
function addUser(event) {
    // Prevent the default behaviour of the browser (reloading the page)
    event.preventDefault();
    // Define JQuery HTML objects
    var addUserForm = $('#add-user-form');
    var usernameField = $('#add-username-input');
    var passwordField = $('#add-password-input');
    var firstNameField = $('#add-first-name-input');
    var lastNameField = $('#add-last-name-input');
    // Read values from input fields
    var username = usernameField.val().toString().trim();
    var password = passwordField.val().toString().trim();
    var firstName = firstNameField.val().toString().trim();
    var lastName = lastNameField.val().toString().trim();
    // Check if all required fields are filled in
    if (firstName && lastName) {
        $.ajax({
            url: '/user',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                password: password,
                username: username
            }),
            contentType: 'application/json',
            success: function (response) {
                // render Message
                renderMessage(response.message);
                // Get new user list from server
                emitAddSignal();
                // Reset the values of all elements in the form
                addUserForm.trigger('reset');
            },
            error: function (error) {
                checkErrorResponse(error);
            },
        }).then(function () { });
    }
    else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }
}
function editUser(event) {
    // Prevent the default behaviour of the browser (reloading the page)
    event.preventDefault();
    // Define JQuery HTML objects
    var editModal = $('#edit-user-modal');
    var editUserForm = $('#edit-user-form');
    var firstNameInput = $('#edit-first-name-input');
    var lastNameInput = $('#edit-last-name-input');
    var idHiddenInput = $('#edit-id-input');
    // Read values from input fields
    var userId = Number(idHiddenInput.val().toString().trim());
    var firstName = firstNameInput.val().toString().trim();
    var lastName = lastNameInput.val().toString().trim();
    // Check if all required fields are filled in
    if (firstName && lastName) {
        $.ajax({
            url: '/user/' + userId,
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
            }),
            contentType: 'application/json',
            success: function (response) {
                // render Message
                renderMessage(response.message);
                // Reset the values of all elements in the form
                editUserForm.trigger('reset');
            },
            error: function (error) {
                checkErrorResponse(error);
            },
        }).then(function () { });
    }
    else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }
    emitUnblockSignal();
    editModal.modal('hide');
}
function deleteUser(event) {
    // Get user id from button attribute 'data-user-id'
    var userId = $(event.currentTarget).data('user-id');
    // Perform ajax request to log out user
    $.ajax({
        url: '/user/' + userId,
        type: 'DELETE',
        dataType: 'json',
        success: function (response) {
            // render Message
            renderMessage(response.message);
            // Get new user list from server
            emitDeleteSignal();
        },
        error: function (error) {
            checkErrorResponse(error);
        },
    }).then(function () { });
}
function openEditUserModal(event) {
    // Get user id from button attribute 'data-user-id'
    var userId = $(event.currentTarget).data('user-id');
    $.ajax({
        url: '/user/' + userId,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            emitBlockSignal(userId);
            renderEditUserModal(response.user);
        },
        error: function (error) {
            checkErrorResponse(error);
        },
    }).then(function () { });
}
function getList() {
    // Perform ajax request to update local user list
    $.ajax({
        url: '/users',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            renderUserList(response.userList);
        },
        error: function (error) {
            checkErrorResponse(error);
        },
    }).then(function () { });
}
/*****************************************************************************
 * Render functions                                                          *
 *****************************************************************************/
function renderMessage(message) {
    // Define JQuery HTML Objects
    var messageWindow = $('#messages');
    // Create new alert
    var newAlert = $("\n        <div class=\"alert alert-warning alert-dismissible fade show\" role=\"alert\">\n            " + message + "\n            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n    ");
    // Add message to DOM
    messageWindow.append(newAlert);
    // Auto-remove message after 5 seconds (5000ms)
    setTimeout(function () {
        newAlert.alert('close');
    }, 5000);
}
function renderUserList(userList) {
    // Define JQuery HTML objects
    var userTableBody = $('#user-table-body');
    // Delete the old table of users from the DOM
    userTableBody.empty();
    var _loop_1 = function (user) {
        // Create html table row element...
        var tableEntry;
        // Check if user is being edited
        if (user.id) {
            $.ajax({
                url: '/user/status/' + user.id,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if (response.status) {
                        tableEntry = $("\n                            <tr>\n                                <td>" + user.id + "</td>\n                                <td>" + user.firstName + "</td>\n                                <td>" + user.lastName + "</td>\n                                <td>" + user.username + "</td>\n                                <td>\n                                    <i class=\"fa fa-lock\" aria-hidden=\"true\"></i>\n                                </td>\n                            </tr>\n                        ");
                    }
                    else {
                        tableEntry = $("\n                            <tr>\n                                <td>" + user.id + "</td>\n                                <td>" + user.firstName + "</td>\n                                <td>" + user.lastName + "</td>\n                                <td>" + user.username + "</td>\n                                <td>\n                                    <button class=\"btn btn-outline-dark btn-sm edit-user-button mr-4\" data-user-id=\"" + user.id + "\" >\n                                        <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>\n                                    </button>\n                                    <button class=\"btn btn-outline-dark btn-sm delete-user-button\" data-user-id=\"" + user.id + "\">\n                                        <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n                                    </button>\n                                </td>\n                            </tr>\n                        ");
                    }
                    // ... and append it to the table's body
                    userTableBody.append(tableEntry);
                },
                error: function (error) {
                    checkErrorResponse(error);
                },
            }).then(function () {
            });
        }
    };
    // For each user create a row and append it to the user table
    for (var _i = 0, userList_1 = userList; _i < userList_1.length; _i++) {
        var user = userList_1[_i];
        _loop_1(user);
    }
}
function renderEditUserModal(user) {
    // Define JQuery HTML objects
    var editUserModal = $('#edit-user-modal');
    var editIdInput = $('#edit-id-input'); // Hidden field for saving the user's id
    var editFirstNameInput = $('#edit-first-name-input');
    var editLastNameInput = $('#edit-last-name-input');
    currentEditing = user.id;
    // Fill in edit fields in modal
    editIdInput.val(user.id);
    editFirstNameInput.val(user.firstName);
    editLastNameInput.val(user.lastName);
    // Show modal
    editUserModal.modal('show');
}
/*****************************************************************************
 * Main Callback: Wait for DOM to be fully loaded                            *
 *****************************************************************************/
$(function () {
    // Define JQuery HTML objects
    var loginForm = $('#login-form');
    var logoutButton = $('#logout-button');
    var addUserForm = $('#add-user-form');
    var editUserForm = $('#edit-user-form');
    var userTableBody = $('#user-table-body');
    var editUserModal = $('#edit-user-modal');
    // Check if user is logged in and toggle login/logout correspondingly
    checkLogin();
    // Register listeners
    loginForm.on('submit', login); // Pass the event into the handler
    logoutButton.on('click', logout);
    addUserForm.on('submit', addUser); // Pass the event into the handler
    editUserForm.on('submit', editUser); // Pass the event into the handler
    userTableBody.on('click', '.edit-user-button', openEditUserModal); // Click listener for edit button
    userTableBody.on('click', '.delete-user-button', deleteUser); // Click listener for delete button
    editUserModal.on('hidden.bs.modal', function () {
        emitUnblockSignal();
    });
});
//# sourceMappingURL=client.js.map