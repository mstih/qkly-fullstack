import React from 'react';
import { CHANGEPASS } from '../utils/Constants';

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.userData
        }
    }

    render() {
        const { u_ime, u_priimek, u_mail, u_datumReg, u_geslo } = this.state.user;
        const pass = '●'.repeat(u_geslo.length);
        return (
            <div className="container mt-5">
                <div className="card p-4">
                    <div className="row">
                        <div className="col-md-4 d-flex justify-content-center align-items-center">
                            <img src='/assets/images/profile-green.png' alt="Profile" className="img-fluid rounded-circle mb-3" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className='h4 py-3'><strong>Name:</strong> {u_ime}</p>
                                        <p className='h4 py-3'><strong>Surname:</strong> {u_priimek}</p>
                                        <p className='h4 py-3'><strong>Email:</strong> {u_mail}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className='h4 py-3'><strong>Registration Date:</strong> {new Date(u_datumReg).toLocaleDateString()}</p>
                                        <p className='h4 py-3'><strong>Password:</strong>{pass}</p>
                                        <button type="button" className="btn btn-primary" onClick={() => this.props.setView({ view: CHANGEPASS })}>Change Password</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileView;