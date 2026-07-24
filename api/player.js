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
            message: "Sahi numeric Player UID enter karein!"
        });
    }

    try {
        // HL Gaming / Forked Repo Base Endpoint
        // Agar aapki apni key/userid hai toh parameters mein include karein
        const targetUrl = `https://proapis.hlgamingofficial.com/main/games/freefire/account/api?sectionName=allData&PlayerUid=${uid}&region=pk`;

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (!response.ok) {
            throw new Error(`API HTTP error: ${response.status}`);
        }

        const data = await response.json();

        // Response structure pass-through
        return res.status(200).json({
            status: true,
            playerStats: data.playerStats || data
        });

    } catch (error) {
        console.error("API Error:", error.message);
        return res.status(500).json({
            status: false,
            message: "Backend response nahi de raha. Credentials ya Server status check karein."
        });
    }
}
