export default async function handler(req, res) {
    // Enable CORS for Netlify Frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { uid } = req.query;

    if (!uid || isNaN(uid)) {
        return res.status(400).json({
            status: false,
            message: "Sahi numeric Player UID enter karein!"
        });
    }

    try {
        // Active Live FF Info Endpoint (PK Region)
        const response = await fetch(`https://freefireinfo-zy9l.onrender.com/api/v1/search-players?keyword=${uid}&server=PK`);

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();

        if (data && data.infos && data.infos.length > 0) {
            const player = data.infos.find(p => p.accountid === uid) || data.infos[0];

            return res.status(200).json({
                status: true,
                data: {
                    uid: player.accountid || uid,
                    nickname: player.nickname || "Unknown",
                    likes: parseInt(player.liked || 0),
                    level: player.level || "N/A"
                }
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Yeh Player UID nahi mili!"
            });
        }

    } catch (error) {
        // Return clear error instead of fake data
        return res.status(503).json({
            status: false,
            message: "Live API Server filhal offline hai. Thodi der baad dubara try karein."
        });
    }
}
