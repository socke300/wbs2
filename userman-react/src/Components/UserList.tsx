import {User} from "../Model-Service/User";
import React from 'react';
import EditUserModal from "./EditUserModal";

export default class UserList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    editBtn(user: User) {
        const modal: any = this.refs.modal;
        modal.state.id = user.id;
        modal.state.firstname = user.firstName;
        modal.state.lastname = user.lastName;
        modal.state.description = user.description;
        modal.show();
    }

    deleteBtn(id: number) {
        this.props.data.deleteUser(id);
        this.props.handleServiceChange();
    }

    render() {
        return (
            <div className="m-4">
                <div className="row">
                    <div className="col">
                        <table className="table table-striped">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First name</th>
                                <th scope="col">Last name</th>
                                <th scope="col">Username</th>
                                <th scope="col">Description</th>
                                <th scope="col">Creation</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody id="user-table-body">
                            {(this.props.data.userList).map((user: User) =>
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.username}</td>
                                    <td>{user.description}</td>
                                    <td>{user.creationTime.toLocaleDateString("de-DE", {day: "2-digit", month: "long", year: "numeric"})}</td>
                                    <td id="buttons">
                                        {!user.isBlocked ?
                                            <button onClick={() => this.editBtn(user)} className="btn btn-sm mr-4">
                                                <svg className="bi bi-pencil-square" fill="currentColor" height="16"
                                                     viewBox="0 0 16 16"
                                                     width="16" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path
                                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                                    />
                                                </svg>
                                            </button> : ""}

                                        {!user.isBlocked ? <button onClick={() => this.deleteBtn(user.id)}
                                                                   className="btn btn-sm">
                                            <svg className="bi bi-trash2-fill" fill="currentColor" height="16"
                                                 viewBox="0 0 16 16" width="16"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
                                            </svg>
                                        </button> : ""}

                                        {user.isBlocked ?
                                            <svg className="bi bi-lock-fill" fill="currentColor"
                                                 height="16"
                                                 viewBox="0 0 16 16"
                                                 width="16"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                            </svg> : ""}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <EditUserModal ref="modal" data={this.props.data} handleServiceChange={this.props.handleServiceChange}/>
                </div>
            </div>
        );
    }
}



