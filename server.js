const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' directory

// TMDB API configuration
const API_KEY = '1cf50e6248dc270629e802686245c2c8'; // Your TMDB API Key
const BASE_URL = 'https://api.themoviedb.org/3';

// Endpoint to get movies
app.get('/api/movies', async(req, res) => {
    try {
        const { sort_by, with_genres, query, page } = req.query;

        let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort_by || 'popularity.desc'}&page=${page || 1}`;

        if (with_genres) {
            url += `&with_genres=${with_genres}`;
        }

        if (query) {
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
        }

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from TMDB');
    }
});

// Proxy endpoint to forward requests to TMDB API
app.get('/api/*', async(req, res) => {
    try {
        const endpoint = req.params[0];
        const queryParams = req.query;
        const url = `${BASE_URL}/${endpoint}?api_key=${API_KEY}&${new URLSearchParams(queryParams).toString()}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});