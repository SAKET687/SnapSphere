"use client";
import React from 'react';
import Image from 'next/image';
import logo from "./Images/image.png";

const Header = () => {
    return (
        <>
            <div className='header'>
                <div className='logo'>
                    <Image src={logo} alt='SnapShere' style={{margin:"10px", height: "50px",width:"100px", borderRadius: "25px" }} />
                </div>
            </div>
        </>
    )
}

export default Header;