import {useState} from "react";
import { Button } from "react-bootstrap";
import Modal from 'react-modal';

function EditModal(props: {onSave: (newFirstName: string, newLastName: string, newDesc: string) => void}){
    const [show, setShow] = useState(-1);

    return (
            <h1>still needs to be done</h1>
    );
}

export default EditModal;