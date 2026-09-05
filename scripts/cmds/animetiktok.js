const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "anime_cache.json");

function getUsed() {
    if (!fs.existsSync(cacheFile)) return [];
    return JSON.parse(fs.readFileSync(cacheFile));
}
function saveUsed(url) {
    let used = getUsed();
    used.push(url);
    if (used.length > 50) used = used.slice(-50);
    fs.writeFileSync(cacheFile, JSON.stringify(used));
}

module.exports = {
    config: {
        name: "animetiktok",
        version: "3.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        guide: "{pn} - 10-15s Anime TikTok Video"
    },

    onStart: async function ({ api, event }) {
        // 10-15s er anime attitude shorts er link
        const videos = [
            "https://youtube.com/shorts/AbCdEfGhIj1", // Gojo Sigma
            "https://youtube.com/shorts/AbCdEfGhIj2", // Zoro Attitude  
            "https://youtube.com/shorts/AbCdEfGhIj3", // Levi Boss Entry
            "https://youtube.com/shorts/AbCdEfGhIj4", // Luffy Gear 5
            "https://youtube.com/shorts/AbCdEfGhIj5", // Sukuna Edit
            "https://youtube.com/shorts/AbCdEfGhIj6", // Tanjiro Rage
            "https://youtube.com/shorts/AbCdEfGhIj7", // Itachi Genjutsu
            "https://youtube.com/shorts/AbCdEfGhIj8", // Madara Susanoo
            "https://youtube.com/shorts/AbCdEfGhIj9", // Eren Titan
            "https://youtube.com/shorts/AbCdEfGhIj10" // Deku 100%
            // ... ekhane aro 40 ta link add korte parba
        ];

        let used = getUsed();
        let available = videos.filter(v => !used.includes(v));
        if (available.length === 0) available = videos; // shob use hoye gele reset

        const randomVideo = available[Math.floor(Math.random() * available.length)];
        saveUsed(randomVideo);

        const captions = [
            "🔥 Sigma Anime Vibes",
            "😎 Boss Mode ON",
            "👑 Tui ki vabsili?",
            "💀 10s er moddhe sesh",
            "⚡ Attitude Level 999"
        ];
        const cap = captions[Math.floor(Math.random() * captions.length)];

        return api.sendMessage(`${cap}\n\n${randomVideo}`, event.threadID, event.messageID);
    }
};
