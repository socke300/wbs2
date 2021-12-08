/*****************************************************************************
 * interface declaration                                                     *
 *****************************************************************************/
// Interface representing a user
interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    creationTime: Date;
    rights: Rights;
}

// Enum for different access levels
enum Rights {
    User,
    // Admin,
    // SuperAdmin,
}

/*****************************************************************************
 * Make connection                                                *
 *****************************************************************************/

let socket = io.connect(window.location.protocol + '//' + window.location.host);

socket.on('blocked', (data) => {
        const tableRow:JQuery = $('#' +'userID\\(' + data + '\\)');
        $(tableRow).find('button').hide();
        $(tableRow).find('#buttons').append("<i id='lock' class=\"fa fa-lock\" aria-hidden=\"true\"></i>");
});

socket.on('unblock', (data) => {
    const tableRow:JQuery = $('#' +'userID\\(' + data + '\\)');
    //$(tableRow).find('#delete-button').show();
    $(tableRow).find('#lock').remove();
    $(tableRow).find('button').show();
});

socket.on('updateList', (data) => {
    getList();
});

/*****************************************************************************
 * Event Handlers (callbacks)                                                *
 *****************************************************************************/
function checkLogin() {
    // Define JQuery HTML objects
    const logoutForm: JQuery = $('#logout-form');
    const contentArea: JQuery = $('#content');
    const greeting: JQuery = $('#navbar-username');

    // Perform ajax request to check if user is logged in
    $.get('/login')
        .then((response) => {
            // User is logged in
            logoutForm.fadeIn();
            contentArea.fadeIn(); // Show content area
            greeting.text(`Hello, ${response.user.username}!`);
            // Get newest user list from server
            updateUserList();
        })
        .catch((error: JQuery.jqXHR) => {
            checkErrorResponse(error);
        });
}

function login(event) {
    // Prevent the default behaviour of the browser (reloading the page)
    event.preventDefault();

    // Define JQuery HTML objects
    const usernameField: JQuery = $('#login-username');
    const passwordField: JQuery = $('#login-password');
    const contentArea: JQuery = $('#content');
    const loginForm: JQuery = $('#login-form');
    const logoutForm: JQuery = $('#logout-form');
    const greetingName: JQuery = $('#navbar-username');

    // Read values from input fields
    const username: string = usernameField.val().toString().trim();
    const password: string = passwordField.val().toString().trim();

    // Check if all required fields are filled in
    if (username && password) {
        // Perform ajax request to log user in
        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                password,
                username
            }),
            contentType: 'application/json'
        })
            .then((response) => {
                // User is logged in
                loginForm.trigger('reset');
                loginForm.fadeOut(() => {
                    logoutForm.fadeIn();
                });
                greetingName.text(`Hello, ${response.user.username}!`);
                contentArea.fadeIn();
                // Get local user list
                updateUserList();
            })
            .catch((error: JQuery.jqXHR) => {
                checkErrorResponse(error);
            });
    } else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }
}

function logout() {
    // Define JQuery HTML objects
    const loginForm: JQuery = $('#login-form');
    const logoutForm: JQuery = $('#logout-form');
    const contentArea: JQuery = $('#content');
    const userListArea: JQuery = $('#user-table');

    // Perform ajax request to log out user
    $.post('/logout')
        .then (() => {
            // User is logged out
            logoutForm.fadeOut(() => {
                loginForm.fadeIn();
            });
            contentArea.fadeOut(); // Hide content area since user is not permitted to see
            userListArea.empty(); // Empty user list since it contains sensitive data
        })
        .catch((error: JQuery.jqXHR) => {
            // User is still logged in
            loginForm.fadeOut();
            logoutForm.fadeIn();
            checkErrorResponse(error);
        })
}

function updateUserList() {
    // Perform ajax request to update local user list
    $.get('/users')
        .then((response) => {
            // User is logged in
            renderUserList(response.userList);
        })
        .catch((error: JQuery.jqXHR) => {
            checkErrorResponse(error);
        })
}

/*****************************************************************************
 * Helper functions                                                          *
 *****************************************************************************/
function checkErrorResponse(error: JQuery.jqXHR): void {
    const logoutForm: JQuery = $('#logout-form');
    const loginForm: JQuery = $('#login-form');
    const contentArea: JQuery = $('#content');
    const userListArea: JQuery = $('#user-table-body');

    renderMessage(error.responseJSON.message);

    if (error.status === 401) {
        logoutForm.fadeOut(() => loginForm.fadeIn());
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
    const addUserForm: JQuery = $('#add-user-form');
    const usernameField: JQuery = $('#add-username-input');
    const passwordField: JQuery = $('#add-password-input');
    const firstNameField: JQuery = $('#add-first-name-input');
    const lastNameField: JQuery = $('#add-last-name-input');

    // Read values from input fields
    const username: string = usernameField.val().toString().trim();
    const password: string = passwordField.val().toString().trim();
    const firstName: string = firstNameField.val().toString().trim();
    const lastName: string = lastNameField.val().toString().trim();

    // Check if all required fields are filled in
    if (firstName && lastName) {
        $.ajax({
            url: '/user',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                firstName,
                lastName,
                password,
                username
            }),
            contentType: 'application/json',
            success: (response) => {
                // render Message
                renderMessage(response.message);
                socket.emit('updateList');
                // Get new user list from server
                getList();
                // Reset the values of all elements in the form
                addUserForm.trigger('reset');
            },
            error: (error: JQuery.jqXHR) => {
                checkErrorResponse(error);
            },
        }).then(()=>{});
    } else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }
}

function editUser(event) {
    // Prevent the default behaviour of the browser (reloading the page)
    event.preventDefault();

    // Define JQuery HTML objects
    const editModal: JQuery = $('#edit-user-modal');
    const editUserForm: JQuery = $('#edit-user-form');
    const firstNameInput: JQuery = $('#edit-first-name-input');
    const lastNameInput: JQuery = $('#edit-last-name-input');
    const idHiddenInput: JQuery = $('#edit-id-input');

    // Read values from input fields
    const userId: number = Number(idHiddenInput.val().toString().trim());
    const firstName: string = firstNameInput.val().toString().trim();
    const lastName: string = lastNameInput.val().toString().trim();

    // Check if all required fields are filled in
    if (firstName && lastName) {
        $.ajax({
            url: '/user/' + userId,
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                firstName,
                lastName,
            }),
            contentType: 'application/json',
            success: (response) => {
                // render Message
                renderMessage(response.message);
                socket.emit('updateList');
                // Update local user list
                getList();
                // Reset the values of all elements in the form
                editUserForm.trigger('reset');
                socket.emit('unblock', userId);
            },
            error: (error: JQuery.jqXHR) => {
                checkErrorResponse(error);
            },
        }).then(()=>{});
    } else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }

    editModal.modal('hide');
}

function deleteUser(event) {
    // Get user id from button attribute 'data-user-id'
    const userId: number = $(event.currentTarget).data('user-id');

    // Perform ajax request to log out user
    $.ajax({
        url: '/user/' + userId,
        type: 'DELETE',
        dataType: 'json',
        success: (response) => {
            // render Message
            renderMessage(response.message);
            socket.emit('updateList');
            // Get new user list from server
            getList();
        },
        error: (error: JQuery.jqXHR) => {
            checkErrorResponse(error);
        },
    }).then(()=>{});
}

function openEditUserModal(event) {
    // Get user id from button attribute 'data-user-id'
    const userId: number = $(event.currentTarget).data('user-id');

    $.ajax({
        url: '/user/' + userId,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            renderEditUserModal(response.user);
            socket.emit('blocked', userId);
        },
        error: (error: JQuery.jqXHR) => {
            checkErrorResponse(error);
        },
    }).then(()=>{});
}

function getList() {
    // Perform ajax request to update local user list
    $.ajax({
        url: '/users',
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            renderUserList(response.userList);
        },
        error: (error: JQuery.jqXHR) => {
            checkErrorResponse(error);
        },
    }).then(()=>{});
}

/*****************************************************************************
 * Render functions                                                          *
 *****************************************************************************/
function renderMessage(message: string) {
    // Define JQuery HTML Objects
    const messageWindow: JQuery = $('#messages');

    // Create new alert
    const newAlert: JQuery = $(`
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);

    // Add message to DOM
    messageWindow.append(newAlert);

    // Auto-remove message after 5 seconds (5000ms)
    setTimeout(() => {
        newAlert.alert('close');
    }, 5000);
}

function renderUserList(userList: User[]) {
    // Define JQuery HTML objects
    const userTableBody: JQuery = $('#user-table-body');

    // Delete the old table of users from the DOM
    userTableBody.empty();
    // For each user create a row and append it to the user table
    for (const user of userList) {
        // Create html table row element...
        const tableEntry: JQuery = $(`
            <tr id="userID(${user.id})">
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.username}</td>
                <td id="buttons">
                        <button id="edit-button" class="btn btn-outline-dark btn-sm edit-user-button mr-4" data-user-id="${user.id}" >
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button id="delete-button" class="btn btn-outline-dark btn-sm delete-user-button" data-user-id="${user.id}">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                </td>
            </tr>
        `);

        // ... and append it to the table's body
        userTableBody.append(tableEntry);
    }
}

function renderEditUserModal(user: User) {
    // Define JQuery HTML objects
    const editUserModal: JQuery = $('#edit-user-modal');
    const editIdInput: JQuery = $('#edit-id-input'); // Hidden field for saving the user's id
    const editFirstNameInput: JQuery = $('#edit-first-name-input');
    const editLastNameInput: JQuery = $('#edit-last-name-input');

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
$(() => {
    // Define JQuery HTML objects
    const loginForm: JQuery = $('#login-form');
    const logoutButton: JQuery = $('#logout-button');
    const addUserForm: JQuery = $('#add-user-form');
    const editUserForm: JQuery = $('#edit-user-form');
    const userTableBody: JQuery = $('#user-table-body');
    const editUserModal: JQuery = $('#edit-user-modal');

    // Check if user is logged in and toggle login/logout correspondingly
    checkLogin();

    // Register listeners
    loginForm.on('submit', login); // Pass the event into the handler
    logoutButton.on('click', logout);
    addUserForm.on('submit', addUser); // Pass the event into the handler
    editUserForm.on('submit', editUser); // Pass the event into the handler
    editUserModal.on('hide.bs.modal', () => {
        socket.emit('unblock', $('#edit-id-input').val());
    });
    userTableBody.on('click', '.edit-user-button', openEditUserModal); // Click listener for edit button
    userTableBody.on('click', '.delete-user-button', deleteUser); // Click listener for delete button
});
