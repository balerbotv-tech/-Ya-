const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "animetiktok_cache.json");

function getUsedVideos() {
    if (!fs.existsSync(cacheFile)) return [];
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
}
function saveUsedVideo(url) {
    let used = getUsedVideos();
    used.push(url);
    if (used.length > 100) used = used.slice(-100);
    fs.writeFileSync(cacheFile, JSON.stringify(used));
}

module.exports = {
    config: {
        name: "animetiktok",
        version: "1.2",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        guide: "{pn} - Anime attitude clip"
    },

    onStart: async function ({ api, event }) {
        try {
            const used = getUsedVideos();
            let mediaUrl;
            let attempts = 0;

            // duplicate na asha porjonto try korbe
            do {
                const res = await axios.get("https://api.waifu.pics/sfw/waifu");
                mediaUrl = res.data.url;
                attempts++;
            } while (used.includes(mediaUrl) && attempts < 5);

            saveUsedVideo(mediaUrl);

            const captions = [
                "🔥 Anime Attitude ON",
                "😎 Boss Entry",
                "👑 Tui ki vabsili?",
                "💀 Haters ra jole jabe",
                "⚡ Sigma Anime Vibes"
            ];
            const randCap = captions[Math.floor(Math.random() * captions.length)];

            const img = await axios.get(mediaUrl, { responseType: "stream" });
            return api.sendMessage({ body: randCap, attachment: img.data }, event.threadID, event.messageID);

        } catch (e) {
            return api.sendMessage("❌ Clip load hoi nai, abar try kor", event.threadID, event.messageID);
        }
    }
};
