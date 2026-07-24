const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/player', async (req, res) => {
    const { uid } = req.query;

    if (!uid || isNaN(uid)) {
        return res.status(400).json({ status: false, message: "Valid numeric UID is required." });
    }

    try {
        // Naya active public endpoint (Region default PK ya IND)
        const targetUrl = `https://freefireinfo-zy9l.onrender.com/api/v1/search-players?keyword=${uid}&server=PK`;
        
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        const data = response.data;
        
        // Check if player list exists and has items
        if (data && data.infos && data.infos.length > 0) {
            // Find exact match by accountid or pick the first one
            const player = data.infos.find(p => p.accountid === uid) || data.infos[0];

            return res.json({
                status: true,
                data: {
                    uid: player.accountid || uid,
                    nickname: player.nickname || "Unknown",
                    likes: parseInt(player.liked || 0),
                    level: player.level || "N/A",
                    region: player.region || "PK"
                }
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Player info not found for this UID."
            });
        }

    } catch (error) {
        console.error("API Error:", error.message);
        return res.status(500).json({
            status: false,
            message: "External API error or maintenance."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
