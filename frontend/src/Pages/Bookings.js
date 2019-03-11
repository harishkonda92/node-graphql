import React, { Component } from 'react';
import authContext from '../Context/auth-context';
import Spinner from '../Components/Spinners/Spinner';
import BookingList from '../Components/Bookings/BookingList/BookingList'
class BookingsPage extends Component {
    static contextType = authContext;
    state = {
        isLoading: false,
        bookings: []
    }
    componentDidMount() {
        this.fetchBookings()
    }
    fetchBookings() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
            query{ 
                bookings{
                    _id,
                    createdAt,
                    event{
                        _id,
                        title,
                        date
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
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request failed');
                }
                return res.json();
            })
            .then(resData => {
                const bookings = resData.data.bookings;
                this.setState({ bookings: bookings, isLoading: false })
                console.log(resData)
            })
            .catch(error => {
                this.setState({ isLoading: false })
                console.log(error)
            });
    }
    onCancelBookingHandler = bookingId => {
        const requestBody = {
            query: `
            mutation{ 
                cancelBooking(bookingId: "${bookingId}"){
                    _id,
                    title
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
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Request failed');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
                    return { bookings: updatedBookings, isLoading: false };
                })
            })
            .catch(error => {
                console.log(error)
            });
    }
    render() {
        return (
            <React.Fragment>
                {this.state.isLoading ? <Spinner /> : (
                    <BookingList
                        bookings={this.state.bookings}
                        cancelBooking={this.onCancelBookingHandler}
                    ></BookingList>
                )}
            </React.Fragment>
        );
    }
}

export default BookingsPage;