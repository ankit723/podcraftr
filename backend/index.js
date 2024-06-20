require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware to allow requests from your frontend
app.use(cors());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/api/token', async (req, res) => {
    try {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await axios.post('https://www.reddit.com/api/v1/access_token', querystring.stringify({
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'MyAPI/0.0.1'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

app.get('/api/stories', async (req, res) => {
    const { search, accessToken } = req.query;

    try {
        const response = await axios.get(`https://oauth.reddit.com/search/?q=${search.split(' ').join('+')}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'MyAPI/0.0.1'
            }
        });

        res.json(response.data.data.children.map((post) => post.data));
    } catch (error) {
        console.error('Error fetching stories:', error.message);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

app.get('/api/story/:id', async (req, res) => {
    const { id } = req.params;
    const { accessToken } = req.query;

    try {
        const response = await axios.get(`https://oauth.reddit.com/comments/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'MyAPI/0.0.1'
            }
        });
        
        const comments = response.data[1].data.children.map((comment) => comment.data);
        const storyData = response.data[0].data.children[0].data;

        res.json({ story: storyData, comments: comments });
    } catch (error) {
        console.error('Error fetching story:', error.message);
        res.status(500).json({ error: 'Failed to fetch story' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
