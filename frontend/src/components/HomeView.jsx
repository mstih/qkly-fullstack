import React, { Component } from 'react'

export default class HomeView extends Component {
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
                <div className='d-flex flex-column justify-content-center align-items-center h-75 text-white'>
                    <h1 className='fs-1'>Home</h1>
                    <p className='mw-80'>Testing home page and the components connected to it</p>
                    <div className='d-flex justify-content-between'>
                        <button className='btn btn-white text-white border-white rounded-pill py-2 px-3 me-3 fs-5'>Learn more</button>
                        <button className='btn btn-primary text-white rounded-pill py-2 px-3 fs-5'>Search</button>
                    </div>
                </div>

            </div>
        )
    }
}
