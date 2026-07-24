const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Main Route
app.get('/api/player', (req, res) => {
    const { uid } = req.query;

    if (!uid || isNaN(uid)) {
        return res.status(400).json({ 
            status: false, 
            message: "Numeric UID enter karein!" 
        });
    }

    return res.json({
        status: true,
        data: {
            uid: uid,
            nickname: "Vercel_Connected_OK",
            likes: 777,
            level: "60",
            region: "PK"
        }
    });
});

// Vercel Serverless Function Export
module.exports = app;
