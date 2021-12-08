import React, {ChangeEvent, FormEvent} from "react";
import {User} from "./User";
import {Button, Form, FormLabel, Modal} from "react-bootstrap";

export class EditModal extends React.Component<{user: User, show: boolean, onSubmit: (user: User) => void, onClose: () => void}, {user: User, show: boolean}> {
    constructor(props: {user: User, onSubmit: (user: User) => void, show: boolean, onClose: () => void}) {
        super(props);
        this.state = {
            show: props.show,
            user: {...props.user}
        }
    }

    componentWillReceiveProps(nextProps: Readonly<{ user: User; show: boolean; onSubmit: (user: User) => void; onClose: () => void }>, nextContext: any) {
        this.setState(state => ({
           show: nextProps.show,
           user: {...nextProps.user}
        }))
    }

    handleFirstNameChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({
            user: {
                ...this.state.user,
                firstName: event.target.value
            }
        });
    }
    handleLastNameChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({
            user: {
                ...this.state.user,
                lastName: event.target.value
            }
        });
    }
    handleDescriptionChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        this.setState({
            user: {
                ...this.state.user,
                description: event.target.value
            }
        });
    }

    handleClose(){
        this.props.onClose();
    }

    handleSubmit(){
        if(this.state.user.firstName && this.state.user.lastName){
            this.props.onSubmit(this.state.user);
        }
    }

    render() {
        return (
            <>
                <Modal show={this.props.show} onHide={() => {this.handleClose()}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="form-control">
                            ID:
                            <Form.Control name="id" value={this.state.user.id} disabled />
                        </label>
                        <label className="form-control">
                            First Name:
                            <Form.Control name="firstName" value={this.state.user.firstName} onChange={(e) => this.handleFirstNameChange(e)} type="text" placeholder="First Name" style={{margin: '8px 0'}}/>
                        </label>
                        <label className="form-control">
                            Last Name:
                            <Form.Control name="lastname" value={this.state.user.lastName} onChange={(e) => this.handleLastNameChange(e)} type="text" placeholder="Last Name" style={{margin: '8px 0'}}/>
                        </label>
                        <label className="form-control">
                            Description:
                            <textarea className="form-control" name="description" value={this.state.user.description} onChange={(e) => this.handleDescriptionChange(e)} placeholder="Description" style={{margin: '8px 0'}}/>
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {this.handleClose()}}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => {this.handleSubmit()}}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}