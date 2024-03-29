import React from 'react';
import axios from 'axios';
import { API_URL, NO_CONNECTION, TIMEOUT } from '../utils/Constants';


class SavedView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedRoutes: [],
            userId: props.userId,
            status: {
                success: null,
                message: null,
            }
        };
    }

    // Get the data as soon as this page is accessed
    componentDidMount() {
        this.getSavedRoutes();
    }

    getSavedRoutes() {
        if (this.state.userId == null) {
            return;
        }
        axios.get(API_URL + '/saved/all/' + this.state.userId, { timeout: TIMEOUT, withCredentials: true }).then((response) => {
            // If the response code is 201 --> something is not right
            if (response.status === 201) {
                this.setState({ status: response.data.status })
                //this.setState(this.state.status = response.data.status)
                this.setState({ savedRoutes: [] });
                return;
            }
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            console.log(response.data)
            // Filter out the old saved routes
            const sorted = response.data.filter(connection => new Date(connection.r_casOdhod) >= now);

            const withCalculations = sorted.map(connection => {
                const depTime = new Date(connection.r_casOdhod);
                const arrTime = new Date(connection.r_casPrihod);
                const diff = arrTime - depTime;

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const time = `${hours > 0 ? hours + 'h' : ''} ${minutes}min`

                const date = new Date(connection.r_casOdhod);
                const day = date.getDate();
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();
                const finalDate = `${day}. ${month} ${year}`;

                return {
                    ...connection,
                    time: time,
                    date: finalDate,
                };

            });
            this.setState({ savedRoutes: withCalculations }, () => console.log(this.state.savedRoutes));
        }).catch((error) => {
            console.log(error);
            this.setState({ status: { success: false, message: NO_CONNECTION } })
        });
    }

    // Delete a saved route
    async deleteSavedRoute(rid) {
        try {
            const response = await axios.post(API_URL + '/saved/delete_connection', { rid: rid, uid: this.state.userId }, { timeout: TIMEOUT, withCredentials: true });
            if (response.status === 200) {
                // Wait for 500 milliseconds before refreshing the saved routes
                setTimeout(() => {
                    this.getSavedRoutes();
                }, 500);
            } else {
                console.error('Failed to delete saved route:', response);
                this.setState({ status: { success: false, message: NO_CONNECTION } });
            }
        } catch (error) {
            console.error('Error deleting saved route:', error);
            this.setState({ status: { success: false, message: NO_CONNECTION } });
        }
    }

    // COPIED FROM SEARCHVIEW
    downloadCalendarFile(id) {
        axios({
            url: API_URL + '/saved/download/' + id,
            method: 'GET',
            responseType: 'blob', // Important, otherwise will not work
            timeout: TIMEOUT,
            withCredentials: true,
        }).then((response) => {
            // Not sure how exactly but spent 2h figuring out, thanks to some random website it works
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a'); // Like why? 
            link.href = url;
            link.setAttribute('download', 'calendar.ics'); // Crazy way, but i think it works
            document.body.appendChild(link);
            link.click(); // Fake clicking, wtf?
        }).catch((error) => {
            console.log(error);
            this.setState({ status: { success: false, message: NO_CONNECTION } })
        });
    }


    render() {
        return (
            <div className='container'>
                {/* Response */}
                {(this.state.status.success === false && this.state.status.message !== "") ? <p className='alert alert-danger mt-3' role='alert'>{this.state.status.message}</p> : null}
                <div className="my-5">
                    {this.state.savedRoutes.map((route, index) => (
                        <div className="card mb-3 shadow-sm p-2 " key={index}>
                            <div className="row g-0">
                                <div className="col-12">
                                    <div className="card-body pt-3 pb-2">
                                        <div className="d-flex flex-column flex-md-row justify-content-md-between pb-2 border-bottom">
                                            <h5 className="card-title fs-4 m-0">
                                                {route.k_odhod} - {route.k_prihod}
                                            </h5>
                                            <h5 className="card-title fs-4 m-0">
                                                {route.date + ": "}
                                                <strong>
                                                    {String(new Date(route.r_casOdhod).getHours()).padStart(2, '0')}:
                                                    {String(new Date(route.r_casOdhod).getMinutes()).padStart(2, '0')} {" - "}
                                                    {String(new Date(route.r_casPrihod).getHours()).padStart(2, '0')}:
                                                    {String(new Date(route.r_casPrihod).getMinutes()).padStart(2, '0')}
                                                </strong>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body py-2">
                                        <p className="card-text mb-1">Time: {route.time}</p>
                                        <p className="card-text mb-1">Type: {route.vozilo}</p>

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body py-2">
                                        <p className="card-text mb-1">Operator: {route.izvajalec}</p>
                                        <p className="card-text mb-1">Contact: <a href={`mailto:${route.kontakt}`}>{route.kontakt}</a></p>
                                        <p className="card-text mb-1">Link: <a href={route.link}>{route.link}</a></p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mb-3 mt-3">
                                <button className="btn btn-danger me-2 shadow" onClick={() => this.deleteSavedRoute(route.r_id)}>Delete from Saved</button>
                                <button className="btn btn-secondary shadow" onClick={() => this.downloadCalendarFile(route.r_id)}>Save to Calendar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default SavedView;