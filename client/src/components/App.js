import React from 'react';
import $ from 'jquery';
import { PageNav } from './taskboard/Nav';
import Messenger from './messenger/Messenger.js';
import { Tabs, Tab } from 'react-bootstrap';
import { TaskManager } from './taskboard/TaskManager.js';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      house: '',
      tasks: [],
      roommates: [],
      avatar: '',
      showModal: false,
      fbID: '',
    };
  }

  close() {
    this.setState({
      showModal: false,
    });
  }

  open() {
    this.setState({
      showModal: true,
    });
  }

  handleHouseChange(e) {
    this.setState({
      house: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const house = this.state.house;
    const username = this.state.username;

    this.props.socket.emit('addHouse', {
      username: this.state.username,
      house: this.state.house,
    });

    this.props.socket.emit('getAllUsers', this.state.house);
    this.props.socket.emit('getAllTasks', this.state.house);

    this.close();
  }

  componentDidMount() {
    const socket = this.props.socket;

    const self = this;
    $.ajax({
      method: 'GET',
      url: '/getCurrentUser',
    }).done((data) => {
      self.setState({
        house: data.house,
        username: data.username,
        avatar: data.avatar,
        fbID: data.fbID,
      });

      if ( self.state.fbID && !self.state.house ) {
        self.open();
      }
      socket.emit('getAllUsers', this.state.house);
      socket.emit('getAllTasks', this.state.house);
      socket.emit('getAllMessages', this.state.house);
    });

    socket.on('allUsers', (allUsers) => {
      this.setState({
        roommates: allUsers,
      });
    });

    socket.on('allTasks', (allTasks) => {
      this.setState({
        tasks: allTasks.reverse(),
      });
    });

    socket.on('addTask', (taskObj) => {
      const newTasks = this.state.tasks;
      newTasks.unshift(taskObj);
      this.setState({
        tasks: newTasks,
      });
    });

    socket.on('completeTask', (taskObj) => {
      if (taskObj) {
        const newTasks = this.state.tasks.slice();
        const taskIds = newTasks.slice().map(task => task._id);
        const index = taskIds.indexOf(taskObj._id);
        newTasks[index] = taskObj;
        this.setState({
          tasks: newTasks,
        });
      }
    });

    socket.on('addHouse', (user) => {
      this.setState({
        house: user.house,
      });
    });

  }

  render() {
    return (
      <div className="appBody">
        <PageNav roommates={this.state.roommates} username={this.state.username} house={this.state.house} />
        <Tabs style={{height: '50%'}} animation={false} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Task Manager">
            <TaskManager tasks={this.state.tasks} roommates={this.state.roommates} username={this.state.username} house={this.state.house} socket={this.props.socket} />
          </Tab>
          <Tab eventKey={2} title="Messenger">
            <Messenger username={this.state.username} house={this.state.house} socket={this.props.socket} avatar={this.state.avatar}/>
          </Tab>
        </Tabs>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Subscribe to a House</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup >
                <ControlLabel>Enter a House Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.house}
                  placeholder="Enter task description here"
                  onChange={this.handleHouseChange.bind(this)}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSubmit.bind(this)} bsStyle="success">Subscribe</Button>
            <Button onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

