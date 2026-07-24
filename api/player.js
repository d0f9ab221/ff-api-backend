export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ status: false, message: "UID require hai" });
    }

    // Aapka apna custom database object / JSON mapping
    const customDatabase = {
        "9830096384": { nickname: "Mughal_OP", level: "72", likes: 14500, region: "PK" },
        "1234567890": { nickname: "Pro_Gamer_FF", level: "68", likes: 8900, region: "PK" }
    };

    if (customDatabase[uid]) {
        return res.status(200).json({
            status: true,
            data: {
                uid: uid,
                ...customDatabase[uid]
            }
        });
    } else {
        // Dynamic fallback for new UIDs
        return res.status(200).json({
            status: true,
            data: {
                uid: uid,
                nickname: `Player_${uid.slice(-4)}`,
                level: "50",
                likes: 500,
                region: "PK"
            }
        });
    }
}
