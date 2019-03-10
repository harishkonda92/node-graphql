import React, { Component } from 'react';
import './Events.css';
import Modal from '../Components/Modal/Modal';
import BackDrop from '../Components/BackDrop/BackDrop';
import AuthContext from '../Context/auth-context';
class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    };
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.priceRef = React.createRef();
    }
    componentDidMount() {
        this.fetchEvents();
    }
    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }
    modalConfirmHandler = () => {
        const title = this.titleRef.current.value;
        const price = +this.priceRef.current.value;
        const description = this.descriptionRef.current.value;
        if (title.trim().length === 0 ||
            price <= 0 ||
            description.trim().length === 0) {
            return
        }
        const event = { title, price, description };
        console.log(event);
        const requestBody = {
            query: `
            mutation{ 
                createEvent (eventInput: {title: "${title}", price: ${price}, description: "${description}"}){
                    _id,
                    title,
                    description,
                    date,
                    creator{
                        _id,
                        email
                    }
                }
            }
            `
        }
        const token = this.context.token;
        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request failed');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData)
                this.fetchEvents();
            })
            .catch(error => {
                console.log(error)
            });

        this.setState({ creating: false })
    }
    modalCancelHandler = () => {
        this.setState({ creating: false })
    }

    fetchEvents() {
        const requestBody = {
            query: `
            query{ 
                events{
                    _id,
                    title,
                    description,
                    date,
                    creator{
                        _id,
                        email
                    }
                }
            }
            `
        }
        const token = this.context.token;
        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request failed');
                }
                return res.json();
            })
            .then(resData => {
                const events = resData.data.events;
                this.setState({ events: events })
                console.log(resData)
            })
            .catch(error => {
                console.log(error)
            });

    }

    render() {
        const eventList = this.state.events.map(event => {
            return <li key={event._id} className="events__list-item">{event.title}</li>
        })
        return (
            <React.Fragment>
                {this.state.creating &&
                    <Modal title="Add event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                        <form className="modal_form">
                            <div className="form-control">
                                <label htmlFor="title">title</label>
                                <input type="text" id="text" ref={this.titleRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="Deescription">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionRef}></textarea>
                            </div>
                        </form>

                    </Modal>}
                {this.state.creating&& <BackDrop />}
                {this.context.token && <div className="events-control">
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>}
                <ul className="events__list">
                    {eventList}
                </ul>
            </React.Fragment>
        );
    }
}

export default EventsPage;