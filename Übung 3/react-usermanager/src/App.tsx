import React from 'react';
import './App.css';
import {User} from "./User";
import {Table} from "react-bootstrap";
import {Add} from "./Add";
import {EditModal} from "./EditModal";

class App extends React.Component<{}, { title: string, users: User[], show: boolean, editUser: any }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            show: false,
            editUser: undefined,
            title: 'Usermanager',
            users: [new User("Frieda", "Carlo", "Car-los")]
        }
        this.showEditModal = this.showEditModal.bind(this)
    }

    createUser(user: User){
        this.setState(state => ({
            users: [...state.users, user]
        }))
    }

    showEditModal(user: User){
        this.setState(state => ({
            editUser: user,
            show: true
        }))
    }
    hideUserModal(): void{
        this.setState(state => ({
            show: false
        }))
    }

    editUser(editedUser: User){
        let copy: User[] = [];
        for (let user of this.state.users){
            if (user.id === editedUser.id) {
                copy.push(editedUser);
            } else {
                copy.push(user);
            }
        }
        this.setState({
            users: copy,
            show: false
        })
    }
    deleteUser(user: User) {
        let copy: User[] = [...this.state.users];
        for (let entry of this.state.users){
            if (entry.id === user.id){
                copy.splice(copy.indexOf(entry), 1)
                this.setState(state => ({
                    users: copy
                }))
            }
        }
    }

    render() {
        return (
            <div className="App">
                <header>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <div className="row container-fluid">
                                <div className="col">
                                    <a className="navbar-brand" href="#">Usermanager</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
                <body>
                    <div className="row p-5">
                        <div className="col-9">
                            <List items={this.state.users} onDeleteClicked={(user) => {this.deleteUser(user)}} onEditClicked={(user) => {this.showEditModal(user)}}/>
                        </div>
                        <div className="col-3">
                            <Add onCreate={(user) => {this.createUser(user)}}/>
                        </div>
                    </div>
                    <EditModal user={this.state.editUser} show={this.state.show} onSubmit={(user => {this.editUser(user)})} onClose={() => this.hideUserModal()}/>
                </body>
            </div>
        );
    }
}

function List(props: { items: User[], onEditClicked: (user: User) => void , onDeleteClicked: (user: User) => void}) {
    const rows = props.items.map((user) => (
        <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.description}</td>
            <td>{user.date}</td>
            <td>
                <button className="btn" onClick={() => props.onEditClicked(user)}>Edit</button>
                <button className="btn" onClick={() => props.onDeleteClicked(user)}>Delete</button>
            </td>
        </tr>
    ));

    return (
        <Table>
            <thead>
            <tr>
                <th>Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Description</th>
                <th>Creation Date</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </Table>
    )
}

export default App;
