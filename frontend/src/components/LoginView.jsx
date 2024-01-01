import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL, HOME, NO_CONNECTION, SIGNUP, TIMEOUT } from '../utils/Constants.js'

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        // State stores the current inputs and two responses from the backend(status and user)
        this.state = {
            input: {
                email: "",
                password: "",
                rememberMe: false
            },
            status: {
                success: null,
                message: ""
            },
            user: null,
            disabledButton: true
        }
    }

    // Function to handle entering the data in text fields and then updating the state
    getTextInput(e) {
        this.state.input[e.target.name] = e.target.value;
        this.setState({ input: this.state.input })
        this.checkInputForLock();
    }
    // Function to handle updating the state for remember me checkbox
    getRememberMeChoice(e) {
        this.state.input.rememberMe = !this.state.input.rememberMe;
        this.setState({ input: this.state.input });
        console.log(this.state.input.rememberMe)
    }

    // Each time you user enters something it checks for the input and if both fields are not empty it unlocks the button 
    // No need for check when submiting
    checkInputForLock() {
        if (this.state.input.email === "" || this.state.input.password === "") {
            this.setState({ disabledButton: true })
        } else {
            this.setState({ disabledButton: false })
        }
    }

    // Function to handle the submit button
    handleSubmit = (event) => {
        event.preventDefault();
        let request = axios.create({ timeout: TIMEOUT, withCredentials: true });
        request.post(API_URL + '/users/login', {
            email: this.state.input.email,
            pass: this.state.input.password
        })
            .then((response) => {
                console.log("Login request sent!")
                console.log(this.state.user_input)
                console.log(response.status)
                if (response.status === 200) {
                    console.log(response.data)
                    this.setState(this.state.status = response.data.status);
                    this.setState(this.state.user = response.data.user)
                }
                this.props.getLoginDataFromChild(this.state);

                setTimeout(() => this.props.setView({ view: HOME }), 1500);
            }).catch(error => {
                console.log(error);
                this.setState({ status: { success: false, message: NO_CONNECTION } })
            }

            );
    }

    doNotHaveAccountYet() {
        setTimeout(() => this.props.setView({ view: SIGNUP }), 500);
    }

    render() {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6">

                        <h2 className='text-center'>Login</h2>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" name="email" onChange={this.getTextInput.bind(this)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" name="password" onChange={this.getTextInput.bind(this)} />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" name="rememberMe" onChange={this.getRememberMeChoice.bind(this)} />
                                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                            </div>
                            <button type="submit" disabled={this.state.disabledButton} className="btn btn-primary px-4 py-2">Login</button>
                        </form>
                        <div className='mt-3'>
                            <a href="#" onClick={this.doNotHaveAccountYet.bind(this)}>Don't have an account yet? Sign up here</a>
                        </div>
                        {/* Response on submit click*/}
                        <div className='my-3'>
                            {this.state.status.success ?
                                <p className="alert alert-success"
                                    role="alert">{this.state.status.message}</p> : null}

                            {!this.state.status.success &&
                                this.state.status.message !== "" ?
                                <p className="alert alert-danger"
                                    role="alert">{this.state.status.message}</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
LoginView.propTypes = {
    getLoginDataFromChild: PropTypes.func.isRequired,
};


export default LoginView;