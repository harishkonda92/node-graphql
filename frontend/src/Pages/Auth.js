import React, { Component } from 'react';
import './Auth.css';
class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.emailEL = React.createRef();
        this.passwordEL = React.createRef();
    }
    state = {
        isLogin: true
    }
    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin }
        })
    }
    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEL.current.value;
        const password = this.passwordEL.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        console.log(email, password);
        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password:"${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}"}){
                            _id
                            email
                        }
                    }
                `
            };
        }
        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
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
            })
            .catch(error => {
                console.log(error)
            });
    }
    render() {
        return <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" ref={this.emailEL} />
            </div>
            <div className="form-control">
                <label htmlFor="password">password</label>
                <input type="password" id="password" ref={this.passwordEL} />
            </div>
            <div className="form-actions">
                <button type="submit">submit</button>
                <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>
    }
}

export default AuthPage;