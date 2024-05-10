import React, { useState } from 'react';
import supabase from '../../../Database/supabase';
import { useNavigate } from "react-router-dom";
import "./Components.css";

const Upload = ({ closeUploadPopup }) => {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const uploadPost = async () => {
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        try {
            const { data, error } = await supabase.storage.from('snapsphere_images').upload(`public/${file.name}`, file, {
                cacheControl: '3600',
                upsert: false,
            });
            if (error) {
                throw error;
            }
            const file_name = file.name;

            // Add post to the database
            const { data: postData, error: postError } = await supabase
                .from('snap_post')
                .insert([{
                    image: file_name,
                    description: description,
                }]);
            if (postError) {
                throw postError;
            }

            setMessage("Post uploaded successfully!");
            setDescription(''); 
            setFile(null);
            navigate('/');
        } catch (error) {
            console.error('Error uploading post:', error.message);
            setMessage("An error occurred while uploading the post.");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await uploadPost();
    }

    return (
        <>
            <div className='upload'>
                <h2 className="close-button" onClick={closeUploadPopup} style={{ textAlign: "right", marginTop: "50px", padding: "10px", cursor: "pointer" }}>X</h2>
                <h2 style={{ textAlign: "left" }}>Upload Post</h2>

                <div className="product-container">
                    <form onSubmit={handleSubmit}>
                        <div className="product-field">
                            <div className="product-label">Image (max. 5MB):</div>
                            <div className="product-div">
                                <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                        </div>

                        <div className="product-field">
                            <div className="product-label">Description:</div>
                            <div className="product-div">
                                <textarea placeholder='Enter description........ (optional)' value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="4" />
                            </div>
                        </div>

                        <div className="upload-button">
                            <button type="submit" className="uploading-btn">Upload</button>
                        </div>
                        {message && <div className="message" style={{ textAlign: "center", margin: "10px", padding: "10px", backgroundColor: "white", color: "purple" }}>{message}</div>}
                    </form>
                </div>
            </div>
        </>
    )
}

export default Upload;
