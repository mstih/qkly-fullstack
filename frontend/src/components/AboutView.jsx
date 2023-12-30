import React from 'react';

class AboutView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container mt-5">
                <div className='row justify-content-center'>
                    <div className='col-12 col-md-8'>
                        <h1 className='blackBorderSmall pb-2'>About Qkly</h1>
                        <p className='lead'>
                            Qkly is a revolutionary service designed to simplify your public transport journeys. We provide comprehensive information on all available public transport connections between your selected cities, making it easier than ever to plan your travels.
                        </p>
                        <p className='lead'>
                            By signing up for Qkly, you gain the ability to save your preferred routes for future reference. But that's not all - we also offer the option to download an ICS file of your route, allowing you to save it directly to your calendar. This means you'll never forget about an upcoming journey again.
                        </p>
                        <p className='lead'>
                            Our mission is to make travel planning as quick and effortless as possible. Join us on our journey to redefine public transport.
                        </p>
                    </div>
                </div>
                <div className='row justify-content-center mt-5'>
                    <div className='col-12 col-md-8'>
                        <h2 className='blackBorderSmall pb-2'>How to Use Qkly</h2>
                        <p className='lead'>
                            1. Enter your starting city and destination in the search bar.
                        </p>
                        <p className='lead'>
                            2. Browse through the list of available public transport connections.
                        </p>
                        <p className='lead'>
                            3. Select a route to view more details.
                        </p>
                        <p className='lead'>
                            4. Sign up or log in to save your preferred routes and download an ICS file for your calendar.
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}


export default AboutView;