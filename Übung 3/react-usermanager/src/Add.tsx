import React, {ChangeEvent, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import {User} from "./User";

export class Add extends React.Component<{ onCreate: (user: User) => void }, {firstName: string, lastName: string, description: string}> {
    constructor(props: {onCreate: (user: User) => void}) {
        super(props);
        this.state = {firstName: '', lastName: '', description: ''}
    }

    handleFirstNameChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({firstName: event.target.value});
    }
    handleLastNameChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({lastName: event.target.value});
    }
    handleDescriptionChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({description: event.target.value});
    }

    handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        if(this.state.firstName && this.state.lastName){
            this.props.onCreate(new User(this.state.firstName, this.state.lastName, this.state.description));
        }
        this.setState(state => ({
        firstName: '', lastName: '', description: ''
        }))
    }

    render() {
        return (
            <div>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <Form.Control name="firstName" value={this.state.firstName} onChange={(e) => this.handleFirstNameChange(e)} type="text" placeholder="First Name" style={{margin: '8px 0'}}/>
                    <Form.Control name="lastname" value={this.state.lastName} onChange={(e) => this.handleLastNameChange(e)} type="text" placeholder="Last Name" style={{margin: '8px 0'}}/>
                    <textarea className="form-control" name="description" value={this.state.description} onChange={(e) => this.handleDescriptionChange(e)} placeholder="Description" style={{margin: '8px 0'}}/>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </div>
        );
    }

}