const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "animetiktok_cache.json");

// Use kora video gula save korar jonno
function getUsedVideos() {
    if (!fs.existsSync(cacheFile)) return [];
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
}
function saveUsedVideo(url) {
    let used = getUsedVideos();
    used.push(url);
    // 100 tar beshi hole puran gula delete
    if (used.length > 100) used = used.slice(-100);
    fs.writeFileSync(cacheFile, JSON.stringify(used));
}

module.exports = {
    config: {
        name: "animetiktok",
        version: "1.1",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        guide: "{pn} - Anime attitude TikTok video"
    },

    onStart: async function ({ api, event }) {
        try {
            const used = getUsedVideos();

            // SFW anime attitude API - protibar new video
            let videoUrl;
            let attempts = 0;
            do {
                const res = await axios.get("https://api.waifu.im/random/?included_tags=waifu&is_nsfw=false");
                videoUrl = res.data.images[0].url;
                attempts++;
            } while (used.includes(videoUrl) && attempts < 5); // duplicate avoid

            saveUsedVideo(videoUrl);

            const captions = [
                "🔥 Anime Attitude ON",
                "😎 Boss Entry",
                "👑 Tui ki vabsili?",
                "💀 Haters ra jole jabe",
                "⚡ Sigma Anime Vibes"
            ];
            const randCap = captions[Math.floor(Math.random() * captions.length)];

            const video = await axios.get(videoUrl, { responseType: "stream" });
            return api.sendMessage({ body: randCap, attachment: video.data }, event.threadID, event.messageID);

        } catch (e) {
            return api.sendMessage("❌ Video load hoi nai, abar try kor", event.threadID, event.messageID);
        }
    }
};
