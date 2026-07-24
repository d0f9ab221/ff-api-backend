export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { uid } = req.query;

    if (!uid || isNaN(uid)) {
        return res.status(400).json({ status: false, message: "Valid UID enter karein!" });
    }

    // Aapka custom local player records database
    const database = {
        "9830096384": {
            solostats: { gamesplayed: 381, wins: 98, kills: 1279, detailedstats: { damage: 355099, headshotkills: 162 } },
            duostats: { gamesplayed: 95, wins: 14, kills: 222, detailedstats: { damage: 69400, headshotkills: 18 } },
            quadstats: { gamesplayed: 3771, wins: 1621, kills: 9881, detailedstats: { damage: 4978192, headshotkills: 854 } }
        }
    };

    if (database[uid]) {
        return res.status(200).json({
            status: true,
            playerStats: database[uid]
        });
    } else {
        return res.status(404).json({
            status: false,
            message: "Yeh UID database mein nahi mili."
        });
    }
}
