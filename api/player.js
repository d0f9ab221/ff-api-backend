export default async function handler(req, res) {
    // Enable CORS
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
            message: "Sahi numeric UID enter karein!"
        });
    }

    try {
        // EquipAPI active regional endpoint
        const targetUrl = `https://equipapi.vercel.app/api/ff?uid=${uid}&region=pk`;

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Extracting data based on EquipAPI format
        if (result && (result.nickname || result.Name || result.basicInfo)) {
            const nickname = result.nickname || result.Name || result.basicInfo?.nickname || "Unknown";
            const likes = result.likes || result.Likes || result.basicInfo?.likes || 0;
            const level = result.level || result.Level || result.basicInfo?.level || "N/A";
            const region = result.region || result.Region || "PK";

            return res.status(200).json({
                status: true,
                data: {
                    uid: uid,
                    nickname: nickname,
                    likes: parseInt(likes),
                    level: level,
                    region: region
                }
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Player info nahi mili is UID par."
            });
        }

    } catch (error) {
        console.error("Fetch Error:", error.message);
        return res.status(500).json({
            status: false,
            message: "API server filhal response nahi de raha. Thodi der baad try karein."
        });
    }
}
