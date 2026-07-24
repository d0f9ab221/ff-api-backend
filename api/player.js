export default function handler(req, res) {
    // Enable CORS for Netlify
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

    // Dynamic clean stats generator based on UID input
    const baseVal = parseInt(uid.slice(-4)) || 1234;

    const responseData = {
        status: true,
        playerStats: {
            solostats: {
                gamesplayed: Math.floor(baseVal / 10),
                wins: Math.floor(baseVal / 80),
                kills: Math.floor(baseVal / 3),
                detailedstats: {
                    damage: baseVal * 250,
                    headshotkills: Math.floor(baseVal / 12)
                }
            },
            duostats: {
                gamesplayed: Math.floor(baseVal / 5),
                wins: Math.floor(baseVal / 45),
                kills: Math.floor(baseVal / 2),
                detailedstats: {
                    damage: baseVal * 450,
                    headshotkills: Math.floor(baseVal / 8)
                }
            },
            quadstats: {
                gamesplayed: Math.floor(baseVal / 2),
                wins: Math.floor(baseVal / 15),
                kills: baseVal * 2,
                detailedstats: {
                    damage: baseVal * 1200,
                    headshotkills: Math.floor(baseVal / 3)
                }
            }
        }
    };

    return res.status(200).json(responseData);
}
