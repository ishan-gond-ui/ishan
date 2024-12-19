import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await fetch('/api/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    return data;
});

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        selectedPost: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // Actions
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
