import {Button, Form} from 'react-bootstrap';
import React, {ChangeEvent, FormEvent} from 'react';

export class AddForm extends React.Component<{ onCreate: (firstName: string, lastName: string, description: string) => void }, { newUserFirstname: string, newUserLastname: string, newUserDescription: string }> {
    constructor(props: { onCreate: (firstName: string, lastName: string, description: string) => void }) {
        super(props);
        this.state = {
            newUserFirstname: '',
            newUserLastname: '',
            newUserDescription: ''
        }
    }

    handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        this.props.onCreate(this.state.newUserFirstname, this.state.newUserLastname, this.state.newUserDescription);
    }

    handleChangeFirstName(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        this.setState({newUserFirstname: event.target.value});
    }

    handleChangeLastName(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        this.setState({newUserLastname: event.target.value});
    }

    handleChangeDescription(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        this.setState({newUserDescription: event.target.value});
    }

    render() {
        return (
            <div>
                <h3>New User</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <Form.Control value={this.state.newUserFirstname}
                                  onChange={(e) => this.handleChangeFirstName(e)}
                                  type="text" placeholder="First-Name" style={{margin: '8px 0'}}/>
                    <Form.Control value={this.state.newUserLastname}
                                  onChange={(e) => this.handleChangeLastName(e)}
                                  type="text" placeholder="Last-Name" style={{margin: '8px 0'}}/>
                    <Form.Control value={this.state.newUserDescription}
                                  onChange={(e) => this.handleChangeDescription(e)}
                                  type="text" placeholder="Description" style={{margin: '8px 0'}}/>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}