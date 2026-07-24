export default function handler(req, res) {
    // Enable CORS (Allow Netlify to access)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { uid } = req.query;

    if (!uid || isNaN(uid)) {
        return res.status(400).json({
            status: false,
            message: "Sahi numeric UID enter karein!"
        });
    }

    // Direct Static Test Response
    return res.status(200).json({
        status: true,
        data: {
            uid: uid,
            nickname: "Vercel_Direct_OK",
            likes: 9999,
            level: "75",
            region: "PK"
        }
    });
}

