const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/player', (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ status: false, message: "UID enter karein!" });
    }

    // Direct Test Data (Confirming connection)
    return res.json({
        status: true,
        data: {
            uid: uid,
            nickname: "Test_Player_OP",
            likes: 9999,
            level: "75",
            region: "PK"
        }
    });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
