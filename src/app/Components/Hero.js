"use client";

import React, { useState, useEffect } from 'react';
import uploadIcon from "./Images/upload_icon.png";
import Image from 'next/image';
import Upload from './Upload';
import Posts from './Posts';

const Hero = () => {
    const [uploadPopupVisible, setUploadPopupVisible] = useState(false);

    const closeUploadPopup = () => {
        setUploadPopupVisible(false);
    };

    return (
        <>
            <div style={{ width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", width: "100px", backgroundColor: "#8a2be2", alignItems: "center", borderRadius: "10px", margin: "10px", padding: "5px" }} onClick={() => setUploadPopupVisible(true)}>
                    <div>
                        <Image style={{ height: "40px", width: "auto" }} src={uploadIcon} alt="Upload Icon" />
                    </div>
                    <div>
                        Upload
                    </div>
                </div>
            </div>
            {uploadPopupVisible && <Upload closeUploadPopup={closeUploadPopup} />}
            <Posts />
        </>
    );
}

export default Hero;
