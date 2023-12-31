import React from 'react';
import axios from 'axios';
import { API_URL } from '../utils/Constants';

class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            departure: null,
            arrival: null,
            date: null,
            buttonLocked: true,
            results: [],
            user: props.user,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    };


    componentDidMount() {
        axios.get(API_URL + '/kraji')
            .then(response => {
                this.setState({ cities: response.data });
                console.log(this.state.cities)
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                this.setState({ message: 'Error fetching data' });
            });
    }

    checkButtonLock() {
        if (this.state.arrival == null || this.state.departure == null || this.state.date == null) {
            this.setState({ buttonLocked: true })
        } else {
            this.setState({ buttonLocked: false })
        }
    }

    handleInputChange(event) {
        const target = event.target;
        let value;
        try {
            value = JSON.parse(target.value);
        } catch (error) {
            console.log(error.message);
            return
        }
        const name = target.name;
        this.setState({
            [name]: value
        }, () => {
            console.log(this.state);
            this.checkButtonLock();
        });

    }

    handleDateChange(event) {
        const value = event.target.value;
        this.setState({
            date: value
        }, () => {
            console.log(this.state);
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
        console.log("DATA: " + JSON.stringify(data));

        axios.post(API_URL + '/connections/search', data).then(response => {
            // First the results are sorted by departure time
            const sortedConnections = response.data.sort((a, b) => new Date(a.r_casOdhod) - new Date(b.r_casOdhod));

            // Calculate the time difference
            const withCalculations = sortedConnections.map(connection => {
                const depTime = new Date(connection.r_casOdhod);
                const arrTime = new Date(connection.r_casPrihod);
                const diff = arrTime - depTime;

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const time = `${hours}:${minutes}`

                return {
                    ...connection,
                    time: time
                };
            });

            // Move results to state so they can be displayed
            this.setState({ results: withCalculations }, () => console.log(this.state.results));
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        });
    }

    // THANKS GOD IT WORKS
    downloadCalendarFile(id) {
        axios({
            url: API_URL + '/saved/download/' + id,
            method: 'GET',
            responseType: 'blob', // Important, otherwise will not work
        }).then((response) => {
            // Not sure how exactly but spent 2h figuring out, thanks to some random website it works
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'calendar.ics');
            document.body.appendChild(link);
            link.click();
        }).catch((error) => {
            console.log(error);
        });
    }

    handleSaveRoute(r_id) {
        const data = {
            rid: r_id,
            uid: this.state.user.u_id
        }
        axios.post(API_URL + '/saved/save_connection', data).then((response) => {
            if (response.status === 200) {
                alert("Saved!");
            } else {
                alert("Not saved: " + response.data.status.message);
            }
        }).catch((error) => { console.log(error); });
    }

    render() {
        const todayFull = new Date().toISOString();
        const today = todayFull.split('T')[0];

        const { departure, arrival, cities } = this.state;
        // To prevent the two cities be identical, filter out the ones that are already selected
        const departureCities = cities.filter(city => city.k_ime !== (arrival && arrival.k_ime));
        const arrivalCities = cities.filter(city => city.k_ime !== (departure && departure.k_ime));
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="text-center">
                            <h2>Search</h2>
                        </div>
                        <div className="card mb-4">
                            <div className="card-body">
                                <form onSubmit={this.handleSearch}>
                                    <div className="row align-items-end">
                                        <div className="col">
                                            <label htmlFor="departure" className="form-label">Departure</label>
                                            <select className="form-control" id="departure" name="departure" onChange={this.handleInputChange.bind(this)}>
                                                <option value={null}></option>
                                                {departureCities.map((city, index) => <option key={index} value={JSON.stringify(city)}>{city.k_ime}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="arrival" className="form-label">Arrival</label>
                                            <select className="form-control" id="arrival" name="arrival" onChange={this.handleInputChange.bind(this)}>
                                                <option value={null}></option>
                                                {arrivalCities.map((city, index) => <option key={index} value={JSON.stringify(city)}>{city.k_ime}</option>)}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input type="date" className="form-control" id="date" name="date" min={today} onChange={this.handleDateChange.bind(this)} />
                                        </div>
                                        <div className="col text-center mt-2 mt-sm-0">
                                            <button type="submit" className="btn btn-primary w-100">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="container">
                            {this.state.results.map((result, index) => (
                                <div className="card mb-3" key={index}>
                                    <div className="row g-0">
                                        <div className="col-12">
                                            <div className="card-body pt-3 pb-2">
                                                <h5 className="card-title fs-4 m-0">
                                                    {String(new Date(result.r_casOdhod).getHours()).padStart(2, '0')}:
                                                    {String(new Date(result.r_casOdhod).getMinutes()).padStart(2, '0')} -
                                                    {String(new Date(result.r_casPrihod).getHours()).padStart(2, '0')}:
                                                    {String(new Date(result.r_casPrihod).getMinutes()).padStart(2, '0')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body py-2">
                                                <p className="card-text mb-1">Time: {result.time}</p>
                                                <p className="card-text mb-1">Operator: {result.izvajalec}</p>
                                                <p className="card-text mb-1">Contact: <a href={`mailto:${result.kontakt}`}>{result.kontakt}</a></p>
                                                <p className="card-text mb-1">Link: <a href={result.link}>{result.link}</a></p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card-body py-2">
                                                <p className="card-text mb-0">Type: {result.vozilo}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.user !== null ? (
                                        <div className="d-flex justify-content-center mb-3">
                                            <button className="btn btn-primary me-2" disabled={this.state.disableSave} onClick={() => this.handleSaveRoute(result.r_id)}>Save Route</button>
                                            <button className="btn btn-secondary" onClick={() => this.downloadCalendarFile(result.r_id)}>Save to Calendar</button>
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