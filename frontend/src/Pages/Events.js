import React, { Component } from 'react';
import './Events.css';
import Modal from '../Components/Modal/Modal';
import BackDrop from '../Components/BackDrop/BackDrop';
class EventsPage extends Component {
    state = {
        creating: false
    };
    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }
    modalConfirmHandler = () => {
        this.setState({ creating: false })
    }
    modalCancelHandler = () => {
        this.setState({ creating: false })
    }
    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Modal title="Add event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                    <p> Modal content</p>
                </Modal>}
                {/* <BackDrop /> */}
                <div className="events-control">
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;