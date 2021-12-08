import React from 'react';
import './App.css';
import AddUser from "./Components/AddUser";
import {DataService} from "./Model-Service/DataService";
import UserList from "./Components/UserList";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./Components/NavBar";

export default class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {data: new DataService()};
        this.handleServiceChange = this.handleServiceChange.bind(this);
    }

    handleServiceChange(): void {
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <NavBar/>
                <BrowserRouter>
                    <Routes>
                        <Route path="" element={
                            <>
                                <AddUser data={this.state.data} handleServiceChange={this.handleServiceChange}/>
                                <UserList data={this.state.data} handleServiceChange={this.handleServiceChange}/>
                            </>
                        }/>
                        <Route path="add" element={<AddUser data={this.state.data}
                                                            handleServiceChange={this.handleServiceChange}/>}/>
                        <Route path="list" element={<UserList data={this.state.data}
                                                              handleServiceChange={this.handleServiceChange}/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}
