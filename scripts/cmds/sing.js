const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

// 3 TA BACKUP API - 1 TA DOWN HOILE ONNO TA
const API_LIST = [
    (url) => `https://api.cobalt.tools/api/json`, // API 1 - SOBCHE STABLE
    (url) => `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=audio&quality=128kbps&apikey=rubenk`, // API 2
    (url) => `https://deku-rest-api.gleeze.com/api/youtube/ytmp3?url=${encodeURIComponent(url)}` // API 3
];

async function getMP3(videoUrl) {
    let lastError;
    for(let fn of API_LIST) {
        try {
            const apiUrl = fn(videoUrl);
            if(apiUrl.includes("cobalt")) {
                const res = await axios.post(apiUrl, {
                    url: videoUrl,
                    downloadMode: "audio",
                    audioFormat: "mp3"
                }, { timeout: 20000 });
                if(res.data?.url) return { title: res.data.filename, url: res.data.url };
            } else {
                const res = await axios.get(apiUrl, { timeout: 20000 });
                const data = res.data;
                if(data?.data?.url) return { title: data.data.title, url: data.data.url };
                if(data?.result?.url) return { title: data.result.metadata.title, url: data.result.url };
            }
        } catch(e) { 
            lastError = e; 
            console.log("API fail, trying next...");
            continue; 
        }
    }
    throw new Error("Shob API down. Pore try kor: " + lastError?.message);
}

function react(api, messageID, emoji) {
    try { api.setMessageReaction(emoji, messageID, () => {}, true); } catch (_) {}
}

module.exports.config = {
    name: "sing",
    aliases: ["song", "play"],
    version: "4.0.0",
    author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube theke gaan download",
    category: "media"
};

module.exports.onStart = async function ({ api, event, args, message }) {
    const { messageID } = event;
    const query = args.join(" ").trim();
    if (!query) return message.reply("❌ Song name den.\nExample: sing sahiba");

    react(api, messageID, "⏳");
    let filePath;

    try {
        await message.reply(`🔍 "${query}" search kortesi...`);
        const search = await yts(query);
        const video = search.videos?.[0];
        if (!video) {
            react(api, messageID, "❌");
            return message.reply(`❌ "${query}" er kono result nai`);
        }

        await message.reply(`⬇️ Download hocche: ${video.title}`);
        const data = await getMP3(video.url);

        if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
        filePath = path.join(CACHE_DIR, `${Date.now()}.mp3`);

        const audio = await axios.get(data.url, { responseType: "stream", timeout: 60000 });
        const writer = fs.createWriteStream(filePath);
        audio.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        await message.reply({
            body: `🎶 ${data.title}\n🕒 ${video.timestamp}\n👑 By: 𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇`,
            attachment: fs.createReadStream(filePath)
        }, () => fs.unlinkSync(filePath));

        react(api, messageID, "✅");

    } catch (err) {
        console.error(err);
        react(api, messageID, "❌");
        return message.reply("❌ Download failed: " + err.message);
    }
};
