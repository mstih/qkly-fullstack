import React from 'react';
import axios from 'axios';
import { API_URL } from '../utils/Constants';

class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kraji: [],

        };
    }

    componentDidMount() {
        axios.get(API_URL + '/kraji')
            .then(response => {
                this.setState({ kraji: response.data });
                console.log(this.state.kraji)
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                this.setState({ message: 'Error fetching data' });
            });
    }

    handleInputChange(event) {
        console.log(event.target.value)
    }

    handleSearch = () => {
        // Perform search logic...
    }

    render() {
        const todayFull = new Date().toISOString();
        const today = todayFull.split('T')[0];
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
                                                {/* Render dropdown with cities */}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="arrival" className="form-label">Arrival</label>
                                            <select className="form-control" id="arrival" name="arrival" onChange={this.handleInputChange.bind(this)}>
                                                {/* Render dropdown with cities (no first one) */}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label htmlFor="date" className="form-label">Date</label>
                                            <input type="date" className="form-control" id="date" name="date" min={today} onChange={this.handleInputChange.bind(this)} />
                                        </div>
                                        <div className="col text-center mt-2 mt-sm-0">
                                            <button type="submit" className="btn btn-primary w-100">Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* <p></p> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchView;