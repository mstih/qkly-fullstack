import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../utils/Constants.js'

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        // State stores the current inputs and two responses from the backend(status and user)
        this.state = {
            input: {
                username: "",
                password: "",
                rememberMe: false
            },
            user: null,
            status: {
                success: null,
                message: ""
            }
        }
    }

    // Function to handle entering the data in text fields and then updating the state
    getTextInput(e) {
        this.state.input[e.target.name] = e.target.value;
        this.setState({ input: this.state.input })
    }
    // Function to handle updating the state for remember me checkbox
    getRememberMeChoice(e) {
        this.state.input.rememberMe = !this.state.input.rememberMe;
        this.setState({ input: this.state.input });
        console.log(this.state.input.rememberMe)
    }


    render() {
        return (
            <div>Login View</div>
            //TODO: GUI
        )
    }
}
LoginView.propTypes = {
    getLoginDataFromChild: PropTypes.func.isRequired,
};


export default LoginView;