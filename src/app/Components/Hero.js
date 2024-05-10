"use client";

import React, { useState, useEffect } from 'react';
import uploadIcon from "./Images/upload_icon.png";
import Image from 'next/image';
import supabase from '../../../Database/supabase';
import Upload from './Upload';
import "./Components.css";
import Posts from './Posts';

const Hero = () => {
    const [heroes, setHeroes] = useState([]);
    const [uploadPopupVisible, setUploadPopupVisible] = useState(false);

    const closeUploadPopup = () => {
        setUploadPopupVisible(false);
    };

    const fetchHeroes = async () => {
        try {
            const { data, error } = await supabase.from("snap_post").select("*");
            if (error) {
                throw error;
            }
            setHeroes(data || []);
        } catch (error) {
            console.error('Error fetching heroes:', error.message);
        }
    };

    useEffect(() => {
        fetchHeroes();
    }, []);

    return (
        <>
            <div className="upload-btn" onClick={() => setUploadPopupVisible(true)}>
                <p>
                    <Image style={{ height: "20px" }} src={uploadIcon} alt="Upload Icon" />
                    Upload
                </p>
            </div>
            <h1>Heroes</h1>
            <ul>
                {heroes.map(hero => (
                    <li key={hero.id}>
                        <h2>{hero.description}</h2>
                        <p>Created at: {new Date(hero.created_at).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
            {uploadPopupVisible && <Upload closeUploadPopup={closeUploadPopup} />}
            <Posts/>
        </>
    );
}

export default Hero;
