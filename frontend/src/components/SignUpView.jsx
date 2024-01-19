import React from 'react';
import axios from 'axios';
import { API_URL, LOGIN, NO_CONNECTION, TIMEOUT } from '../utils/Constants';

class SignUpView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {
                name: '',
                surname: '',
                email: '',
                password: '',
            },
            status: {
                success: null,
                message: ""
            },
            disabledButton: true,
        };
    }

    getTextInput = (event) => {
        this.state.input[event.target.name] = event.target.value;
        this.setState({ input: this.state.input })
        this.checkInputForLock();
    }

    checkInputForLock() {
        if (this.state.input.email === "" || this.state.input.password === "" || this.state.input.name === "" || this.state.input.surname === "") {
            this.setState({ disabledButton: true })
        } else {
            this.setState({ disabledButton: false })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios.post(API_URL + "/users/register", {
            name: this.state.input.name,
            surname: this.state.input.surname,
            email: this.state.input.email,
            pass: this.state.input.password
        }, { timeout: TIMEOUT }).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                this.setState({ status: response.data.status });
                setTimeout(() => this.props.setView({ view: LOGIN }), 750)
            } else {
                this.setState({ status: response.data.status });
            }
            console.log("Sent registration request!")
        }).catch(error => {
            console.log(error);
            this.setState({ status: { success: false, message: NO_CONNECTION } })
        });
    }

    allreadyHaveAccount() {
        setTimeout(() => this.props.setView({ view: LOGIN }), 500);
    }

    render() {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6">
                        <div className="text-center">
                            <h2>Sign Up</h2>
                        </div>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" name="name" onChange={this.getTextInput} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="surname" className="form-label">Surname</label>
                                <input type="text" className="form-control" id="surname" name="surname" onChange={this.getTextInput} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" name="email" onChange={this.getTextInput} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" name="password" onChange={this.getTextInput} />
                            </div>
                            <button type="submit" disabled={this.state.disabledButton} className="btn btn-primary">Sign Up</button>
                        </form>
                        <div className='mt-3'>
                            <a href="#" onClick={this.allreadyHaveAccount.bind(this)}>Allready have an account? Login here</a>
                        </div>
                        {/* Response */}
                        <div className='mt-3'>
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

export default SignUpView;