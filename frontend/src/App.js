import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';
import AuthPage from './Pages/Auth';
import BookingsPage from './Pages/Bookings';
import EventsPage from './Pages/Events';
import MainNavigation from './Components/navigation/MainNavigation';
class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" component={null} exact />
                <Route path="/auth" component={AuthPage} />
                <Route path="/events" component={EventsPage} />
                <Route path="/bookings" component={BookingsPage} />
              </Switch>
            </main>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
