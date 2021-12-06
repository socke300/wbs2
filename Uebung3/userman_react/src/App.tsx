import React from 'react';
import './App.css';
import {Container, Navbar, Row, Col} from 'react-bootstrap';
import {User} from "./model/User";
import UserTable from "./components/UserTable";
import {AddForm} from "./components/AddForm";

class App extends React.Component<{}, {title: string, userList: User[], userIds: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      title: 'Usermanager',
      userIds: 2,
      userList: [
        new User(0, 'Niklas',  'Thy', 'TestDescription Niklas Thy is here', new Date()),
        new User(1, 'Kevin',  'Linne', 'TestDescription for Kevin Linne is here', new Date()),
      ]
    }
  }

  render(){
    return <div>
      <Navbar bg="light">
        <Navbar.Brand>{this.state.title}</Navbar.Brand>
      </Navbar>
      <Container>
        <Row>
          <Col md={9}>
            <UserTable userList={this.state.userList} onDelete={(user) => this.deleteUser(user)}/>
          </Col>
          <Col>
            <AddForm onCreate={(firstName, lastName, description) => this.createUser(firstName, lastName, description)}/>
          </Col>
        </Row>
      </Container>
    </div>;
  }

  createUser(firstName: string, lastName: string, description: string){
    this.setState(state => ({
      userList: [...state.userList, new User(state.userIds, firstName, lastName, description, new Date())]
    }));
    this.setState(state => ({
      userIds: state.userIds + 1
    }));
  }

  deleteUser(user: User){
    this.setState(state => ({
      userList: state.userList.filter((item) => {return item !== user})
    }));
  }
}

export default App;
