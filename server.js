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
        return res.status(400).json({ status: false, message: "Numeric UID required." });
    }

    // Multiple sources array
    const endpoints = [
        `https://ff-api-virtex.vercel.app/api/info?uid=${uid}`,
        `https://freefire-virtex-api.vercel.app/api/info?uid=${uid}`
    ];

    for (let url of endpoints) {
        try {
            const response = await axios.get(url, { timeout: 5000 });
            const data = response.data;
            const name = data.AccountInfo?.AccountName || data.basicInfo?.nickname || data.nickname || data.Name;
            
            if (name) {
                return res.json({
                    status: true,
                    data: {
                        uid: uid,
                        nickname: name,
                        likes: parseInt(data.AccountInfo?.Likes || data.likes || 0),
                        level: data.AccountInfo?.Level || data.level || "N/A",
                        region: data.AccountInfo?.AccountRegion || data.region || "N/A"
                    }
                });
            }
        } catch (e) {
            console.log("Failed endpoint, trying next...");
        }
    }

    return res.status(500).json({ status: false, message: "Free Fire APIs temporarily down. Try again later." });
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
