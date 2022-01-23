// Types
type User = { name: string, role: number };
type Data = { [id: string]: User };
type AdminTaskResult = string;

enum UserError {
    userNotFound = "User not found.",
}

// Data
let data: Data = {
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
function getUserData(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = data[id];
            if (user == null) {
                reject(UserError.userNotFound);
            } else {
                resolve(user);
            }
        }, 1000);
    });
}

// Checks, if the given user is an admin.
function isAdmin(user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (user.role === 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, 1000);
    });
}

// Performs a generic admin task, that has a result value.
function performAdminTask(): Promise<AdminTaskResult> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("87944551335548");
        }, 1000);
    });
}

// Performs a generic user task, that has no result.
function performUserTask(): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

// Performs either an admin or an user task, based on the role of the given user.
async function performTaskOnUser(userId: string): Promise<void> {
    try {
        const user = await getUserData(userId);
        console.log(`User selected: ${user.name}`);
        const admin: boolean = await isAdmin(user);
        if (admin) {
            const task = await performAdminTask();
            console.log(`Result of admin task: ${task}`);
        } else {
            await performUserTask();
            console.log("The user task was successful.");
        }
        console.log("All tasks finished.");
    } catch (e) {
        console.error(e);
    }
}

// The main programm, which performs the user's corresponding tasks.
async function main() {
    try {
        const res = await performTaskOnUser("4876");
        const res2 = await performTaskOnUser("5412");
        const res3 = await performTaskOnUser("0000");
    } catch (e) {
        console.error(e);
    }
}

// Run the main programm.
main();
