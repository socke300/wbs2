import React from "react";
import {Button, Modal} from 'react-bootstrap';

export default class EditUserModal extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            id: 0,
            firstname: '',
            lastname: '',
            description: '',
            show: false
        };

        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.changeFirstname = this.changeFirstname.bind(this);
        this.changeFirstname = this.changeFirstname.bind(this);
    }

    show() {
        this.setState({show: true});
    }

    close() {
        this.setState({show: false});
    }

    save() {
        if (this.state.lastname.trim().length > 0 && this.state.firstname.trim().length > 0) {
            this.props.data.editUser(this.state.firstname, this.state.lastname, this.state.id, this.state.description);
            this.props.handleServiceChange();
            this.close();
        }
    }

    changeFirstname = (event: any) => this.setState({firstname : event.target.value});
    changeLastname = (event: any) => this.setState({lastname : event.target.value});
    changeDescription = (event: any) => this.setState({description : event.target.value});

    render() {
        return <Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="form-group">
                    <label>ID</label>
                    <input className="form-control" type="text" disabled value={this.state.id}/>

                    <label>Firstname</label>
                    <input className="form-control" type="text" onChange={this.changeFirstname} value={this.state.firstname}/>

                    <label>Lastname</label>
                    <input className="form-control" type="text" onChange={this.changeLastname} value={this.state.lastname}/>

                    <label>Description</label>
                    <input className="form-control" type="text" onChange={this.changeDescription} value={this.state.description}/>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={this.close}>
                    Close
                </Button>
                <Button variant="primary" onClick={this.save}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    }
}
