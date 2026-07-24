export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { uid } = req.query;

    if (!uid || isNaN(uid)) {
        return res.status(400).json({ status: false, message: "Numeric UID required!" });
    }

    // Direct Active API Attempt
    try {
        const response = await fetch(`https://freefireinfo-zy9l.onrender.com/api/v1/search-players?keyword=${uid}&server=PK`);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.infos && data.infos.length > 0) {
                const player = data.infos.find(p => p.accountid === uid) || data.infos[0];
                return res.status(200).json({
                    status: true,
                    data: {
                        uid: player.accountid || uid,
                        nickname: player.nickname,
                        likes: parseInt(player.liked || 0),
                        level: player.level,
                        region: player.region || "PK"
                    }
                });
            }
        }
    } catch (e) {
        console.log("API Error:", e);
    }

    // NO FAKE DATA ANYMORE - Direct Error Response
    return res.status(500).json({
        status: false,
        message: "Public APIs down hain. Aapki apni custom API ki zaroorat hai!"
    });
}
