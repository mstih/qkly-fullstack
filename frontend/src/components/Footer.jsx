import React from 'react';
import { GITHUB_URL, MAIL } from '../utils/Constants';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-second text-white w-100">
            <div className="container-fluid d-flex justify-content-center">
                <span className="pe-3">© {new Date().getFullYear()} Qkly</span>
                <a href={GITHUB_URL} className="text-white pe-3" target="_blank">GitHub</a>
                <a href={"mailto:" + MAIL} className="text-white pe-3">Contact me</a>
            </div>
        </footer>
    );
}

export default Footer;