/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import github from "./Images/github_icon.png";
import linkedin from "./Images/linkedin_icon.png";
import instagram from "./Images/insta_icon.png";
import x_icon from "./Images/x_icon.png";
import facebook from "./Images/fb_icon.png";
import Image from 'next/image';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <div style={sectionStyle}>
                    <h4>About SnapSphere</h4>
                    <p>
                        Capture life's moments, share your world - SnapSphere, where every snapshot tells a story.
                    </p>
                </div>
                <div style={sectionStyle}>
                    <h4>Contact Information</h4>
                    <p>Email: info@snapsphere.com</p>
                    <p>Phone: +91 99999 00000</p>
                    <div>
                        <a href="https://www.instagram.com/" target="_blank">
                            <Image src={instagram} style={{ height: "45px", width: '45px', margin: "4px", border: "1px solid purple" }} />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank">
                            <Image src={facebook} style={{ height: "45px", width: '45px', margin: "4px", border: "1px solid purple" }} />
                        </a>
                        <a href="https://www.x.com/" target="_blank">
                            <Image src={x_icon} style={{ height: "45px", width: '45px', margin: "4px", border: "1px solid purple" }} />
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank">
                            <Image src={linkedin} style={{ height: "45px", width: '45px', margin: "4px", border: "1px solid purple" }} />
                        </a>
                        <a href="https://www.github.com/" target="_blank">
                            <Image src={github} style={{ height: "45px", width: '45px', margin: "4px", border: "1px solid purple" }} />
                        </a>
                    </div>
                </div>
            </div>
            <div style={copyrightStyle}>
                <p>&copy; {new Date().getFullYear()} SnapSphere. All rights reserved.</p>
            </div>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '2rem 0',
    marginTop: '2rem',
    textAlign: 'center',
    bottom: '0'

};

const containerStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
};

const sectionStyle = {
    flex: '1',
    maxWidth: '300px',
    margin: '0 1rem'
};

const copyrightStyle = {
    backgroundColor: '#222',
    padding: '1rem 0',
    marginTop: '2rem',
    textAlign: 'center'
};

export default Footer;
