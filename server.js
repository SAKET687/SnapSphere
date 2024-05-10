import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const app = express();
const server = createServer(app);
const io = socketIo(server);

const supabaseUrl = "https://dytpynmiajyukcncmcrf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dHB5bm1pYWp5dWtjbmNtY3JmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTI4MzkxMiwiZXhwIjoyMDMwODU5OTEyfQ.ZrCMuvHXIIG8FDkk4qNvhHCP7OU-GIOTJ9SNr9Pwt0c";
const supabase = createClient(supabaseUrl, supabaseKey);


io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('like', async (postId) => {
        try {
            const { data, error } = await supabase
                .from('snap_post')
                .update({ no_likes: supabase.sql('no_likes + 1') })
                .eq('post_id', postId)
                .single();

            if (error) {
                throw error;
            }
            console.log('Like status updated successfully');
            io.emit('like', data);
        } catch (error) {
            console.error('Error updating like:', error.message);
            socket.emit('error', { message: 'Error updating like status.' });
        }
    });

    socket.on('comment', async (comment) => {
        try {
            const { data, error } = await supabase.from('snap_comments').insert([
                { comments: comment.text, post_id: comment.postId },
            ]);

            if (error) {
                throw error;
            }
            console.log('Comment added successfully');
            io.emit('comment', data[0]);
        } catch (error) {
            console.error('Error adding comment:', error.message);
            socket.emit('error', { message: 'Error adding comment.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
