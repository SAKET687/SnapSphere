import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import supabase from '../../../Database/supabase';
import "./Components.css";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase.from("snap_post").select("*");
            if (error) {
                throw error;
            }
            setPosts(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
            setError('Error fetching posts. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const openProductDetailPopup = (post) => {
        // Define your popup logic here
        console.log('Opening popup for post:', post);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>Posts</div>
            {posts.map((post) => (
                <div className="product-card" key={post.post_id} onClick={() => openProductDetailPopup(post)}>
                    <div className="product">
                        <div className="product-image">
                            <Image alt="product-preview" src={`https://dytpynmiajyukcncmcrf.supabase.co/storage/v1/object/public/snapsphere_images/public/${post.image}`} width={50} height={50} />
                        </div>
                        <div className="product-info">
                            <p>Title: {post.post_id}</p>
                            <p>Description: {post.description}</p>
                            <p>Uploaded at: {post.created_at}</p>
                            <p>Likes: {post.no_likes}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Posts;
