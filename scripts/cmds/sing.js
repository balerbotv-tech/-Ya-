const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

// 3 TA API BACKUP RAKHLAM. 1 TA DOWN HOILE ONNO TA TRY KORBE
const API_LIST = [
    "https://youtube-mp36.p.rapidapi.com/dl", // API 1
    "https://api.cobalt.tools/api/json", // API 2
    "https://ytjar.herokuapp.com/download" // API 3
];

async function fetchSongInfo(videoUrl) {
    let lastError;
    
    for(let api of API_LIST) {
        try {
            // API 1: RapidAPI
            if(api.includes("rapidapi")) {
                const res = await axios.get(api, {
                    params: { id: videoUrl.split("v=")[1] },
                    headers: { "X-RapidAPI-Key": "YOUR_KEY" }, // free key lagbe na
                    timeout: 15000
                });
                if(res.data?.link) return { title: res.data.title, downloadUrl: res.data.link };
            }

            // API 2: Cobalt.tools - SOBCHE VALO
            if(api.includes("cobalt")) {
                const res = await axios.post(api, {
                    url: videoUrl,
                    downloadMode: "audio",
                    audioFormat: "mp3"
                }, { timeout: 20000 });
                if(res.data?.url) return { title: res.data.filename, downloadUrl: res.data.url };
            }

            // API 3: Ytjar
            if(api.includes("ytjar")) {
                const res = await axios.get(api, { params: { url: videoUrl, format: "mp3" }, timeout: 20000 });
                if(res.data?.url) return { title: res.data.title, downloadUrl: res.data.url };
            }
            
        } catch(e) { lastError = e; continue; }
    }
    throw new Error("Shob API down. Pore abar try kor: " + lastError?.message);
}

async function streamDownloadToFile(dlUrl, filePath) {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    const response = await axios.get(dlUrl, { responseType: "stream", timeout: 300000 });
    const writer = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("close", resolve);
        writer.on("error", reject);
    });
    const stats = fs.statSync(filePath);
    if (stats.size < 1024) throw new Error(`File choto: ${stats.size} bytes`);
}

function tempFilePath(ext) {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    return path.join(CACHE_DIR, `sing_${Date.now()}. ${ext}`);
}

function react(api, messageID, emoji) {
    try { api.setMessageReaction(emoji, messageID, () => {}, true); } catch (_) {}
}

module.exports.config = {
    name: "sing",
    aliases: ["song", "play"],
    version: "2.1.0",
    author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube theke gaan download",
    category: "media",
    guide: { en: "{pn} <song name>\nExample: {pn} sahiba" }
};

module.exports.onStart = async function ({ api, event, args, message }) {
    const { messageID } = event;
    const query = args.join(" ").trim();
    if (!query) return message.reply("❌ Song name den.\nExample: sing sahiba");

    react(api, messageID, "⏳");
    let file;

    try {
        await message.reply(`🔍 "${query}" search kortesi...`);
        const search = await yts(query);
        const video = search.videos?.[0];
        if (!video) {
            react(api, messageID, "❌");
            return message.reply(`❌ "${query}" er kono result nai`);
        }

        await message.reply(`⬇️ Download hocche: ${video.title}`);
        const info = await fetchSongInfo(video.url);
        file = tempFilePath("mp3");
        await streamDownloadToFile(info.downloadUrl, file);

        await message.reply({
            body: `🎶 ${video.title}\n🕒 ${video.timestamp}\n👑 By: 𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇`,
            attachment: fs.createReadStream(file)
        });
        react(api, messageID, "✅");

    } catch (err) {
        console.error(err);
        react(api, messageID, "❌");
        return message.reply("❌ Download failed: " + err.message);
    } finally {
        if (file) try { fs.unlinkSync(file); } catch (e) {}
    }
};
