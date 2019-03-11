import React, { Component } from 'react';
import './Events.css';
import Modal from '../Components/Modal/Modal';
import BackDrop from '../Components/BackDrop/BackDrop';
import AuthContext from '../Context/auth-context';
import EventList from '../Components/Events/EventList/EventList';
import Spinner from '../Components/Spinners/Spinner';
class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };
    isActive = true;
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
                    price
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
                // this.fetchEvents();
                this.setState(prevState => {
                    const updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.date,
                        price,
                        creator: {
                            _id: this.context.userId,
                        }
                    });
                    return { events: updatedEvents }
                });
            })
            .catch(error => {
                console.log(error)
            });

        this.setState({ creating: false })
    }
    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null })
    }

    fetchEvents() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
            query{ 
                events{
                    _id,
                    title,
                    description,
                    date,
                    price,
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
                if (this.isActive) {
                    const events = resData.data.events;
                    this.setState({ events: events, isLoading: false });
                }
                console.log(resData)
            })
            .catch(error => {
                if (this.isActive) {
                    this.setState({ isLoading: false })
                    console.log(error)
                }
            });

    }
    showDetailHandler = eventId => {
        this.setState(prevState => {
            console.log(eventId)
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent }
        })
    }
    bookEventHandler = () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }
        const requestBody = {
            query: `
            mutation{ 
                bookEvent (eventId: "${this.state.selectedEvent._id}"){
                    _id,
                    createdAt,
                    updatedAt
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
                this.setState({ selectedEvent: null });
                console.log(resData)
                // this.fetchEvents();
            })
            .catch(error => {
                console.log(error)
            });
    }
    componentWillUnmount() {
        this.isActive = false;
    }
    render() {
        return (
            <React.Fragment>
                {this.state.creating &&
                    <Modal
                        confirmText={'Confirm'}
                        title="Add event"
                        canCancel canConfirm
                        onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
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
                {this.state.creating || this.state.selectedEvent && <BackDrop />}
                {this.context.token && <div className="events-control">
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>}
                {this.state.selectedEvent &&
                    <Modal title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm
                        confirmText={this.context.token ? 'Book event' : 'Confirm'}
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}>
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>₹{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                }
                {this.state.isLoading ? (<Spinner />) :
                    (<EventList
                        events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />)}
            </React.Fragment>
        );
    }
}

export default EventsPage;