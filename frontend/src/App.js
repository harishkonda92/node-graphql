import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';
import AuthPage from './Pages/Auth';
import BookingsPage from './Pages/Bookings';
import EventsPage from './Pages/Events';
import MainNavigation from './Components/navigation/MainNavigation';
import AuthContext from './Context/auth-context';
class App extends Component {
  state = {
    token: null,
    userId: null,
  }
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId })
  }
  logout = () => {
    this.setState({ token: null, userId: null })
  }
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}>
              <MainNavigation />
              <main className="main-content">
                <Switch>
                  {!this.state.token && <Redirect from="/" to="/auth" component={null} exact />}
                  {this.state.token && <Redirect from="/" to="/events" component={null} exact />}
                  {this.state.token && <Redirect from="/auth" to="/events" component={null} exact />}
                  {!this.state.token && <Route path="/auth" component={AuthPage} />}
                  {this.state.token && <Route path="/events" component={EventsPage} />}
                  {this.state.token && <Route path="/bookings" component={BookingsPage} />}
                </Switch>
              </main>
            </AuthContext.Provider>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
