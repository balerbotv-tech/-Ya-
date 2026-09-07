const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");


const DL_API_BASE = "https://api.siputzx.my.id/api/d/ytmp3";

async function fetchSongInfo(videoUrl) {
    const infoRes = await axios.get(DL_API_BASE, {
        params: { url: videoUrl },
        timeout: 60000
    });
    const data = infoRes.data;

    if (!data?.status || !data?.data?.dl) {
        throw new Error(data?.message || "downloadUrl paoa jayni API response e");
    }
    return {
        title: data.data.title,
        downloadUrl: data.data.dl,
        duration: data.data.duration
    };
}

async function streamDownloadToFile(dlUrl, filePath) {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    
    const response = await axios.get(dlUrl, {
        responseType: "stream",
        timeout: 300000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"
        }
    });

    const writer = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let failed = false;
        const onError = (err) => {
            if (failed) return;
            failed = true;
            writer.close();
            fs.unlink(filePath, () => {});
            reject(err);
        };
        response.data.on("error", onError);
        writer.on("error", onError);
        writer.on("close", () => {
            if (!failed) resolve();
        });
    });

    const stats = fs.statSync(filePath);
    if (stats.size < 1024) {
        fs.unlink(filePath, () => {});
        throw new Error(`Downloaded file too small (${stats.size} bytes)`);
    }
}

function extractApiErrorMessage(err) {
    const raw = err.response?.data;
    if (raw && typeof raw === "object") {
        if (raw.message) return raw.message;
        if (raw.error) return raw.error;
    }
    return err.message;
}

function tempFilePath(ext) {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    return path.join(CACHE_DIR, `sing_${Date.now()}_${Math.floor(Math.random() * 1e4)}.${ext}`);
}

async function sendWithRetry(message, msg, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await message.reply(msg);
        } catch (err) {
            const is408 = err?.error === 408 || String(err?.message || err).includes("408");
            if (is408 && i < retries) {
                console.warn(`[sing] Upload timeout, retrying (${i + 1}/${retries})...`);
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            throw err;
        }
    }
}

function react(api, messageID, emoji) {
    try {
        api.setMessageReaction(emoji, messageID, () => {}, true);
    } catch (_) {}
}

module.exports.config = {
    name: "sing",
    aliases: ["song", "play"],
    version: "2.0.0",
    author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇", 
    countDown: 5,
    role: 0,
    shortDescription: "YouTube theke gaan download",
    longDescription:
