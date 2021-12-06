import {User} from "../model/User";
import {Table} from 'react-bootstrap';


function UserTable(props: {userList: User[], onDelete: (user: User) => void}){
    const rows = props.userList.map((user) => (
        <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.description}</td>
            <td>
                <button className="btn btn-outline-danger btn-sm edit-user-button mr-4" onClick={() => props.onDelete(user)}>
                    Delete
                </button>
                <button className="btn btn-outline-light++ btn-sm edit-user-button mr-4">
                    Edit
                </button>
            </td>
        </tr>
    ));

    return (
        <Table striped bordered hover variant="dark">
            <thead>
            <tr>
                <th>#</th>
                <th>Vorname</th>
                <th>Nachname</th>
                <th>Beschreibung</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </Table>
    );
}

export default UserTable;