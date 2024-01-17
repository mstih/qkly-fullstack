import React from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import { API_URL, NO_CONNECTION, TIMEOUT } from '../utils/Constants';

class ChangePassView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            input: {
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            },
            user: props.userData,
            status: {
                success: null,
                message: ""
            },
            buttonLocked: true
        }
        // So i can only use "this.getTextInput"
        this.getTextInput = this.getTextInput.bind(this);
    }

    getTextInput = (event) => {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            input: {
                ...this.state.input,
                [name]: value
            }
        }, () => {
            this.checkInputForLock(); //
        })
    }

    checkInputForLock() {
        const { cPass, nPass, nPass2 } = this.state.input;
        if (cPass === null || nPass === null || nPass2 === null) {
            this.setState({ buttonLocked: true });
        } else {
            this.setState({ buttonLocked: false });
        }
    }

    handleSubmitButtonClick(event) {
        event.preventDefault();
        const cPass = this.state.input.currentPassword;
        const nPass = this.state.input.newPassword;
        const nPass2 = this.state.input.confirmNewPassword;
        if (cPass !== this.state.user.u_geslo) {
            this.setState({ status: { success: false, message: "Your current password is not correct!" } });
            return;
        } else if (nPass !== nPass2) {
            this.setState({ status: { success: false, message: "Your new passwords do not match!" } });
            return;
        } else {
            axios.post(API_URL + "/users/changePass", {
                uid: this.state.user.u_id,
                email: this.state.user.u_mail,
                currentPass: cPass,
                newPass: nPass2
            }, { timeout: TIMEOUT, withCredentials: true }).then((response) => {
                console.log("Password change request sent!");
                if (response.status === 200) {
                    this.setState({ status: response.data.status });
                    // LOGOUT from this session with a small delay
                    setTimeout(() => this.props.logout(), 1500);
                } else {
                    this.setState({ status: response.data.status });
                }
            }).catch((error) => {
                console.error(error);
                this.setState({ status: { success: false, message: NO_CONNECTION } })
            })
        }
    }

    render() {
        const { user } = this.state;
        return (
            <div className="container mt-5">
                <h2>Change Your Password</h2>
                <div className="card p-4">
                    <h5 className="card-title">{user.email}</h5>
                    <form onSubmit={(event) => this.handleSubmitButtonClick(event)}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">User: </label>
                            <input className="form-control" type="text" id="email" value={user.u_mail} disabled />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input type="password" className="form-control" id="currentPassword" name="currentPassword" onChange={this.getTextInput} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" className="form-control" id="newPassword" name="newPassword" onChange={this.getTextInput} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input type="password" className="form-control" id="confirmNewPassword" name="confirmNewPassword" onChange={this.getTextInput} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={this.state.buttonLocked}>Change Password</button>
                    </form>
                </div>
                <div className='my-3 mb-3'>
                    {this.state.status.success ?
                        <p className="alert alert-success"
                            role="alert">{this.state.status.message}</p> : null}

                    {!this.state.status.success &&
                        this.state.status.message !== "" ?
                        <p className="alert alert-danger"
                            role="alert">{this.state.status.message}</p> : null}
                </div>
            </div>
        )
    }
}
ChangePassView.propTypes = {
    logout: PropTypes.func.isRequired,
};

export default ChangePassView