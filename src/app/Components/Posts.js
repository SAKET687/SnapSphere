"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Image from 'next/image';
import supabase from '../../../Database/supabase';
import "./Components.css";
import like_before from "./Images/like_before.png";
import like_after from "./Images/like_after.png";

const socket = io('http://localhost:3000/');

const Posts = ({ commentData }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comment_message, setCommentMessage] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        socket.on('like', (postId) => {
            fetchPosts();
        });

        return () => {
            socket.off('like');
        };
    }, []);

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

    const openProductDetailPopup = async (post) => {
        await fetchPosts(); setSelectedPost(post);
        await fetchComments(post.post_id);
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        const isLiked = likedPosts.includes(post.post_id);
        setSelectedPost(prevPost => ({
            ...prevPost,
            liked: isLiked
        }));
    };

    const closeUploadPopup = async () => {
        setSelectedPost(null);
        await fetchPosts();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('snap_comments')
                .insert([{
                    comments: comment_message,
                    post_id: selectedPost.post_id
                }]);
            if (error) {
                throw error;
            }
            console.log('Comment submitted successfully');
            fetchComments(selectedPost.post_id);
        } catch (error) {
            console.error('Error submitting comment:', error.message);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const { data, error } = await supabase
                .from('snap_comments')
                .select('*')
                .eq('post_id', postId);
            if (error) {
                throw error;
            }
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error.message);
        }
    };

    const handleLike = async (postId) => {
        try {
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
            if (likedPosts.includes(postId)) {
                let updatedLikes = selectedPost.no_likes - 1;
                const { data, error } = await supabase
                    .from('snap_post')
                    .update({ no_likes: updatedLikes })
                    .eq('post_id', postId);

                if (error) {
                    throw error;
                }
                console.log('Dislike status updated successfully');
                setSelectedPost(prevPost => ({
                    ...prevPost,
                    no_likes: updatedLikes,
                    liked: false
                }));
                const updatedLikedPosts = likedPosts.filter(id => id !== postId);
                localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
            } else {
                let updatedLikes = selectedPost.no_likes + 1;
                const { data, error } = await supabase
                    .from('snap_post')
                    .update({ no_likes: updatedLikes })
                    .eq('post_id', postId);

                if (error) {
                    throw error;
                }
                console.log('Like status updated successfully');
                setSelectedPost(prevPost => ({
                    ...prevPost,
                    no_likes: updatedLikes,
                    liked: true
                }));
                likedPosts.push(postId);
                localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            }
            socket.emit('like', postId);
        } catch (error) {
            console.error('Error updating like status:', error.message);
        }
    };


    if (loading) {
        return (<div>Loading...</div>);
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {/* Pop-up */}
            {selectedPost && (
                <div className='pop_up'>
                    <div className='title_x'>
                        <div className='title-date' style={{ marginLeft: "20px" }}>
                            <p>
                                Upload date: {new Date(selectedPost.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 onClick={closeUploadPopup} style={{ marginRight: "20px", cursor: "pointer" }}>
                                X
                            </h3>
                        </div>
                    </div>
                    <hr />
                    <div className='pro-info-main'>
                        <div className="left">
                            <div className="pro-img-prev">
                                <Image alt="product-preview" src={`https://dytpynmiajyukcncmcrf.supabase.co/storage/v1/object/public/snapsphere_images/public/${selectedPost.image}`} width={350} height={250} />
                            </div>
                            <div className='post-desc'>
                                <p>
                                    Caption: {selectedPost.description}
                                </p>
                            </div>
                        </div>
                        <div className="right">
                            <div className="seller-info">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Like(s)</td>
                                            <td>
                                                <span>{selectedPost.no_likes}</span>
                                                <button style={{ margin: "7px", }} onClick={() => handleLike(selectedPost.post_id)}>
                                                    <Image style={{ height: '15px', width: "15px" }} src={selectedPost.liked ? like_after : like_before} alt="like" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="pro-comm">
                                <div>
                                    <h3>
                                        Comments:
                                    </h3>
                                </div>
                                <div style={{ maxHeight: "200px", overflowY: "scroll" }} >
                                    {Array.isArray(comments) && comments.length > 0 ? (
                                        comments.map((comment, idx) => (
                                            <div className='comm-show' key={idx} style={{ display: "flex", justifyContent: "space-around", margin: "5px" }}>
                                                <div className='comm-disp' style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "5px", border: "2px solid black", width: "100%", maxHeight: "100px", overflow: "auto" }}>
                                                    <div style={{ borderRadius: "5px", border: "1px solid white", height: "fit-content" }}>
                                                        <p style={{ margin: "5px" }}>{comment.comments}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No comments available.</p>
                                    )}
                                </div>

                                <div className='comm-input'>
                                    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
                                        <input required placeholder='Enter your comment:' value={comment_message} onChange={(e) => setCommentMessage(e.target.value)} />
                                        <div className="upload-btn">
                                            <button type="submit" style={{ padding: '4px 5px', margin: "5px" }}>
                                                Publish
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='post'>
                {posts.map((post) => (
                    <div className="product-card" key={post.post_id} onClick={() => openProductDetailPopup(post)}>
                        <div className="product">
                            <div className="product-image">
                                <Image alt="product-preview" src={`https://dytpynmiajyukcncmcrf.supabase.co/storage/v1/object/public/snapsphere_images/public/${post.image}`} width={500} height={350} />
                            </div>
                            <div className="product-info">
                                <p> {post.description}</p>
                                <p>Uploaded at: {new Date(post.created_at).toLocaleString()}</p>
                                <p>Like(s): {post.no_likes}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Posts;
