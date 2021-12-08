import React from 'react';
import {User} from "../Model-Service/User";

export default class AddUser extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.addUser = this.addUser.bind(this);
        this.state = {user: new User(0, '', '', '', new Date(), 0, false)};
    }

    addUser(event: any) {
        event.preventDefault();
        if (this.state.user.lastName.trim().length > 0 && this.state.user.firstName.trim().length > 0 &&
            this.state.user.username.trim().length > 0) {

            this.props.data.addUser(this.state.user);
            this.props.handleServiceChange();

            this.setState( {user: new User(0, '', '', '', new Date(), 0, false)});
            (document.getElementById("form") as HTMLFormElement).reset();
        }
    }

    changeFirstname = (event: any) => this.state.user.firstName = event.target.value;
    changeLastname = (event: any) => this.state.user.lastName = event.target.value;
    changeUsername = (event: any) => this.state.user.username = event.target.value;
    changeDescription = (event: any) => this.state.user.description = event.target.value;


    render() {
        return (
            <div className="container mt-2">
                <div className="row">
                    <div className="col">
                        <form onSubmit={this.addUser} id="form">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">First name</span>
                                </div>
                                <input onChange={this.changeFirstname} className="form-control" placeholder="First name"
                                       type="text"/>
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Last name</span>
                                </div>
                                <input onChange={this.changeLastname} className="form-control" placeholder="Last name"
                                       type="text"/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Username</span>
                                </div>
                                <input onChange={this.changeUsername} className="form-control" placeholder="Username"
                                       type="text"/>



                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Description</span>
                                </div>
                                <textarea onChange={this.changeDescription} className="form-control" placeholder="Description"/>
                            </div>
                            <div className="input-group mb-3">
                                <button className="btn btn-info" type="submit">Add user</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
