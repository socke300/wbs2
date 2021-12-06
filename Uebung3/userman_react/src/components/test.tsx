import {User} from "../model/User";
import React from "react";

function UserTableFunction(props: {userList: User[]}){
    return props.userList.map((user) => (
        <tr key={user.id}>
            <td>{user.firstName}</td>
        </tr>
    ));
}
class Group{
    id: number;
    actionType: ActionTypes = 1;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

class UserTableClass extends React.Component<{userList: User[], userGroup: Group[]}, {isShown: Boolean}> {
    constructor(props: {userList: User[], userGroup: Group[]}) {
        super(props);
        this.state = {
            isShown: true,
        }
        const element = (
            <table id={this.props.userGroup[1].id.toString()}>
                <tr>{this.props.userList[2].firstName}</tr>
                <tr>{this.props.userList[2].lastName}</tr>
            </table>
        )
    }
    render(){
        return(
            this.props.userList.map((user) => (
                <tr key={user.id}>
                    <td>{this.state.isShown? user.firstName : ''}</td>
                    <td>{user.lastName}</td>
                </tr>
        )))
    }
}

enum ActionTypes{
    ADD_USER
}

class UserStore{
    static emitChange(){
        return 1;
    }
}
let action: Group = new Group(1, 'test')
// @ts-ignore

export function addUser(title: string) {
    return {
        type: ActionTypes.ADD_USER,
        name: title
    };
}

switch(action.actionType) {
    case ActionTypes.ADD_USER:
        let text = action.name.trim();
        if (text !== '') {
            create(text);
            UserStore.emitChange();
        }
        break;
}

function create(test: string){
    return test;
}

let element = <h1>Hallo Welt!</h1>

console.log(element)