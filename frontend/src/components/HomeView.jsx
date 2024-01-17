import React, { Component } from 'react'
import { ABOUT, SEARCH } from '../utils/Constants'

export default class HomeView extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div className='position-relative w-100 p-0'
                style={{ height: "825px" }}
            >
                <div className='bg-image h-100 position-absolute w-100'
                    style={{
                        backgroundImage: "url('./assets/images/background.png')",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        filter: 'brightness(40%)',
                        zIndex: -1
                    }} >
                </div>
                <div className='d-flex flex-column justify-content-center align-items-center h-75 text-white homeAnimation'>
                    {/* <h1 className='fs-1'>Qkly</h1> */}
                    <img
                        src="/assets/images/one.png"
                        alt="logo"
                        className="main-image mb-4 "
                    ></img>
                    <p className='mw-80 h3'><span className='text-primary'>Quickly</span> find all the connections between cities</p>
                    <div className='d-flex justify-content-between mt-4'>
                        <button className='btn btn-white text-white border-white rounded-pill py-2 px-3 me-3 fs-5' onClick={() => this.props.setView({ view: ABOUT })}>Learn more</button>
                        <button className='btn btn-primary text-white rounded-pill py-2 px-3 fs-5' onClick={() => this.props.setView({ view: SEARCH })}>Search</button>
                    </div>
                </div>

            </div>
        )
    }
}
