import React from 'react';
import axios from 'axios';
import { API_URL, NO_CONNECTION, TIMEOUT } from '../utils/Constants';

class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            departureCities: [],
            arrivalCities: [],
            departure: null,
            arrival: null,
            date: null,
            buttonLocked: true,
            results: [],
            user: props.user,
            status: {
                success: null,
                message: ''
            }
        };

    };

    // Get all the cities as soon as the view is loaded
    componentDidMount() {
        axios.get(API_URL + '/kraji', { timeout: TIMEOUT })
            .then(response => {
                const cities = response.data.sort((a, b) => a.k_ime.localeCompare(b.k_ime));
                this.setState({ cities: cities, departureCities: cities, arrivalCities: cities }, () => console.log(this.state.cities));;
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                this.setState({ status: { success: false, message: NO_CONNECTION } })
            });
    }

    // Check to prevent clicking on search button if any of the input fields is empty
    checkButtonLock() {
        if (this.state.arrival == null || this.state.departure == null || this.state.date == null) {
            this.setState({ buttonLocked: true })
        } else {
            this.setState({ buttonLocked: false })
        }
    }

    handleDepartureChange(event) {
        event.preventDefault();
        const target = event.target;
        let value;
        if (target.value) {
            try {
                value = JSON.parse(target.value);
            } catch (error) {
                console.log(error.message);
                return
            }
        } else {
            value = null;
        }
        this.setState({
            departure: value,
            arrivalCities: value ? this.state.cities.filter(city => city.k_ime !== value.k_ime) : this.state.cities
        }, this.checkButtonLock);
    }

    handleArrivalChange(event) {
        event.preventDefault();
        const target = event.target;
        let value;
        if (target.value) {
            try {
                value = JSON.parse(target.value);
            } catch (error) {
                console.log(error.message);
                return
            }
        } else {
            value = null;
        }
        this.setState({
            arrival: value,
            departureCities: value ? this.state.cities.filter(city => city.k_ime !== value.k_ime) : this.state.cities
        }, this.checkButtonLock);
    }

    handleDateChange(event) {
        const value = event.target.value;
        this.setState({
            date: value
        }, () => {
            this.checkButtonLock();
        });
    }

    handleSearch = (event) => {
        event.preventDefault();
        const { departure, arrival, date } = this.state;

        const data = {
            k1: departure.k_id,
            k2: arrival.k_id,
            date: date
        }

        axios.post(API_URL + '/connections/search', data, { timeout: TIMEOUT }).then(response => {
            if (response.status !== 200) {
                this.setState({ status: response.data.status, results: [] });
                return;
            }
            // First the results are sorted by departure time
            const sortedConnections = response.data.sort((a, b) => new Date(a.r_casOdhod) - new Date(b.r_casOdhod));

            // Calculate the time difference
            const withCalculations = sortedConnections.map(connection => {
                const depTime = new Date(connection.r_casOdhod);
                const arrTime = new Date(connection.r_casPrihod);
                const diff = arrTime - depTime;

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const time = `${hours > 0 ? hours + 'h' : ''} ${minutes}min`

                return {
                    ...connection,
                    time: time
                };
            });

            // Move results to state so they can be displayed
            this.setState({ results: withCalculations, status: response.data.status });
        }).catch((error) => {
            console.log(error)
            this.setState({ status: { success: false, message: NO_CONNECTION } })
        });
    }

    // THANKS GOD IT WORKS
    downloadCalendarFile(id) {
        axios({
            url: API_URL + '/saved/download/' + id,
            method: 'GET',
            responseType: 'blob', // Important, otherwise will not work
            timeout: TIMEOUT,
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

    // Save route to user's saved routes
    handleSaveRoute(r_id) {
        const data = {
            rid: r_id,
            uid: this.state.user.u_id
        }
        axios.post(API_URL + '/saved/save_connection', data, { timeout: TIMEOUT }).then((response) => {
            if (response.status === 200) {
                this.setState({ status: response.data.status });
            } else {
                this.setState({ status: response.data.status });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({ status: { success: false, message: NO_CONNECTION } })
        });
    }

    handleSwitch() {
        //Checks if one of them is empty
        if (this.state.departure == null || this.state.arrival == null) return;
        //Saves the current values
        const currentArrival = this.state.arrival;
        const currentDeparture = this.state.departure;
        //Switches the values and filters cities again
        this.setState({
            departure: currentArrival,
            arrival: currentDeparture,
            departureCities: this.state.cities.filter(c => c.k_ime !== currentDeparture.k_ime),
            arrivalCities: this.state.cities.filter(c => c.k_ime !== currentArrival.k_ime)
        });


    }

    render() {
        const todayFull = new Date().toISOString();
        const today = todayFull.split('T')[0];
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        {/* <div className="text-center">
                            <h2>Search</h2>
                        </div> */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <form onSubmit={this.handleSearch.bind(this)}>
                                    <div className="row align-items-end">
                                        <div className="col">
                                            <label htmlFor="departure" className="form-label">Departure</label>
                                            <select className="form-control" id="departure" name="departure" value={JSON.stringify(this.state.departure)} onChange={this.handleDepartureChange.bind(this)}>
                                                <option value={null}></option>
                                                {this.state.departureCities.map((c, i) => <option key={i} value={JSON.stringify(c)}>{c.k_ime}</option>)}
                                            </select>
                                        </div>
                                        <div className=" col-auto">
                                            <img src="/assets/images/switch.png" alt="Switch" className="cursor-pointer" style={{ width: "40px" }} onClick={this.handleSwitch.bind(this)} />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="arrival" className="form-label">Arrival</label>
                                            <select className="form-control" id="arrival" name="arrival" value={JSON.stringify(this.state.arrival)} onChange={this.handleArrivalChange.bind(this)}>
                                                <option value={null}></option>
                                                {this.state.arrivalCities.map((c, i) => <option key={i} value={JSON.stringify(c)}>{c.k_ime}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input type="date" className="form-control" id="date" name="date" min={today} onChange={this.handleDateChange.bind(this)} />
                                        </div>
                                        <div className="col text-center mt-2 mt-sm-0">
                                            <button type="submit" className="btn btn-primary w-100" disabled={this.state.buttonLocked}>Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* Response */}
                        {this.state.status && this.state.status.success === true ? (<div className='alert alert-success mt-3'>{this.state.status.message}</div>) : null}
                        {(this.state.status && this.state.status.message !== "" && this.state.status.success === false) ? <p className="alert alert-danger mt-3"
                            role="alert">{this.state.status.message}</p> : null}
                        <div className="container mb-3">
                            {this.state.results.map((result, index) => (
                                <div className="card mb-3 shadow-sm" key={index}>
                                    <div className="row g-0">
                                        <div className="col-12">
                                            <div className="card-body pt-3 pb-2 border-bottom mx-2">
                                                <h5 className="card-title fs-4 m-0">
                                                    <strong>
                                                        {String(new Date(result.r_casOdhod).getHours()).padStart(2, '0')}:
                                                        {String(new Date(result.r_casOdhod).getMinutes()).padStart(2, '0')} {" - "}
                                                        {String(new Date(result.r_casPrihod).getHours()).padStart(2, '0')}:
                                                        {String(new Date(result.r_casPrihod).getMinutes()).padStart(2, '0')}
                                                    </strong>
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card-body py-2">
                                                <p className="card-text mb-1">Time: {result.time}</p>
                                                <p className="card-text mb-1">Type: {result.vozilo}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <div className="card-body py-2">
                                                <p className="card-text mb-1">Operator: {result.izvajalec}</p>
                                                <p className="card-text mb-1">Contact: <a target="_blank" href={`mailto:${result.kontakt}`}>{result.kontakt}</a></p>
                                                <p className="card-text mb-1">Link: <a target="_blank" href={result.link}>{result.link}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.user !== null ? (
                                        <div className="d-flex justify-content-center mb-3">
                                            <button className="btn btn-primary me-2 shadow-sm" onClick={() => this.handleSaveRoute(result.r_id)}>Save Route</button>
                                            <button className="btn btn-secondary shadow-sm" onClick={() => this.downloadCalendarFile(result.r_id)}>Save to Calendar</button>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        {/* <p></p> */}
                    </div>
                </div>
            </div >
        )
    }
}

export default SearchView;