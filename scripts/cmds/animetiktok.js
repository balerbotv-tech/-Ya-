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
    if (used.length > 200) used = used.slice(-200);
    fs.writeFileSync(cacheFile, JSON.stringify(used));
}

module.exports = {
    config: {
        name: "animetiktok",
        version: "1.3",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        guide: "{pn} - Anime attitude clip"
    },

    onStart: async function ({ api, event }) {
        const apis = [
            "https://nekos.best/api/v2/neko",
            "https://nekos.life/api/v2/img/neko",
            "https://api.waifu.pics/sfw/waifu"
        ];

        const captions = [
            "🔥 Anime Attitude ON",
            "😎 Boss Entry",
            "👑 Tui ki vabsili?",
            "💀 Haters ra jole jabe",
            "⚡ Sigma Anime Vibes"
        ];
        const randCap = captions[Math.floor(Math.random() * captions.length)];

        for (let apiUrl of apis) {
            try {
                let used = getUsedVideos();
                let res = await axios.get(apiUrl, { timeout: 8000 });

                let mediaUrl = res.data.results?.[0]?.url || res.data.url;
                if (!mediaUrl) continue;
                if (used.includes(mediaUrl)) continue;

                saveUsedVideo(mediaUrl);
                const img = await axios.get(mediaUrl, { responseType: "stream", timeout: 8000 });

                return api.sendMessage({ body: randCap, attachment: img.data }, event.threadID, event.messageID);

            } catch (e) {
                continue; // ei API fail korle porer ta try korbe
            }
        }

        return api.sendMessage("❌ Server busy. 2 min por abar try kor bhai", event.threadID, event.messageID);
    }
};
