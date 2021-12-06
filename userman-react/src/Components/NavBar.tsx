import React from "react";
import {Navbar, Container, Nav} from "react-bootstrap";

export default class NavBar extends React.Component {
    title: string = "Usermanager";

    render() {
        return <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Userman React</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/add">Add User</Nav.Link>
                        <Nav.Link href="/list">UserList</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>;
    }
}
