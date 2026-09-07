const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

async function getMP3(videoUrl) {

    const api = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`;
    const res = await axios.get(api, { timeout: 30000 });
    if(!res.data?.result?.download?.url) throw new Error("Download link nai");
    return {
        title: res.data.result.title,
        url: res.data.result.download.url
    };
}

function react(api, messageID, emoji) {
    try { api.setMessageReaction(emoji, messageID, () => {}, true); } catch (_) {}
}

module.exports.config = {
    name: "sing",
    aliases: ["song", "play"],
    version: "3.1.0",
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

        const audio = await axios.get(data.url, { responseType: "stream" });
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
