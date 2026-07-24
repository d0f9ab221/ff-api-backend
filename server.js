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
        return res.status(400).json({
            status: false,
            message: "Valid numeric UID is required."
        });
    }

    try {
        const response = await axios.get(`https://freefire-virtex-api.vercel.app/api/info?uid=${uid}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 8000
        });

        const data = response.data;

        const name = data.AccountInfo?.AccountName || data.basicInfo?.nickname || data.nickname || data.Name;
        const likes = data.AccountInfo?.Likes || data.basicInfo?.liked || data.likes || data.Likes || 0;
        const level = data.AccountInfo?.Level || data.basicInfo?.level || data.level || data.Level || "N/A";
        const region = data.AccountInfo?.AccountRegion || data.basicInfo?.region || data.region || "N/A";

        if (name) {
            return res.json({
                status: true,
                data: {
                    uid: uid,
                    nickname: name,
                    likes: parseInt(likes),
                    level: level,
                    region: region
                }
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Player info not found for this UID."
            });
        }

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({
            status: false,
            message: "Failed to retrieve player stats. Target service might be down."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

