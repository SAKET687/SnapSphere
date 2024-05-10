import React, { useState } from 'react';
import supabase from '../../../Database/supabase';
import "./Components.css";

const Upload = ({ closeUploadPopup }) => {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const uploadPost = async () => {
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        function generateRandomAlphaNumeric(length) {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                result += charset[randomIndex];
            }
            return result;
        }

        const rs1 = generateRandomAlphaNumeric(10);
        const rs2 = generateRandomAlphaNumeric(5);
        const fileName = `${rs1}_${rs2}`;
        try {
            const { data, error } = await supabase.storage.from('snapsphere_images').upload(`public/${fileName}`, file, {
                cacheControl: '3600',
                upsert: false,
            });
            console.log(data);
            const file_name = fileName;
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
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            setDescription('');
            setFile(null);
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
                                <textarea placeholder='Enter description/caption........ (optional)' value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="4" />
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
