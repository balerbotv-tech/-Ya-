const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const BOSS_ID = "61582149885357";

module.exports = {
    config: {
        name: "usta",
        aliases: ["lathi", "latti", "ustha", "kick"],
        version: "1.0.9",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Kick/Usta meme generator",
            bn: "উস্তা বা লাথি মারার মিম পিকচার বান"
        },
        longDescription: {
            en: "Overlays profile pictures of sender and target user onto the kick meme",
            bn: "কমান্ড দাতা এবং যাকে ট্যাগ করা হয়েছে দুজনের প্রোফাইল পিকচার উস্তা মারার ব্যাকগ্রাউন্ডে বসিয়ে দিবে"
        },
        category: "funny",
        guide: {
            en: "{p}usta @mention OR reply to a message",
            bn: "{p}usta @mention করুন অথবা মেসেজে রিপ্লাই দিন"
        }
    },

    onStart: async function ({ api, event, args, message, usersData }) {
        const cacheFolder = path.join(__dirname, "cache");
        let cachePath = "";
        try {
            const { senderID, mentions, messageReply, messageID } = event;
            let targetID;
            let targetName = "User";

            // 1. Target nirdharon
            if (messageReply) {
                targetID = messageReply.senderID;
            } else if (mentions && Object.keys(mentions).length > 0) {
                targetID = Object.keys(mentions)[0];
                targetName = mentions[targetID].replace("@", "");
            } else if (args && args[0] &&!isNaN(args[0])) {
                targetID = args[0];
            }

            if (!targetID) {
                if (api && typeof api.setMessageReaction === "function") {
                    api.setMessageReaction("❌", messageID, () => {}, true);
                }
                return message.reply("⚠️ যাকে উস্তা/লাথি মারতে চান তাকে ট্যাগ করুন বা তার মেসেজে রিপ্লাই দিন!");
            }

            // 2. Boss Protection
            if (targetID === BOSS_ID) {
                if (api && typeof api.setMessageReaction === "function") {
                    api.setMessageReaction("👑", messageID, () => {}, true);
                }
                return message.reply("🛑 থামেন ভাই! ইনি আমার বস 🙇‍♂️\nবসের গায়ে উস্তা মারা নিষেধ! 👑✨");
            }

            if (api && typeof api.setMessageReaction === "function") {
                api.setMessageReaction("🦶", messageID, () => {}, true);
            }

            const kickerID = senderID;

            if (usersData && typeof usersData.getName === "function") {
                try {
                    targetName = await usersData.getName(targetID);
                } catch (e) {}
            }

            // 3. Image downloader
            async function fetchBuffer(url) {
                const res = await axios.get(url, {
                    responseType: "arraybuffer",
                    maxRedirects: 10,
                    headers: { "User-Agent": "Mozilla/5.0" },
                    timeout: 10000
                });
                return Buffer.from(res.data, "binary");
            }

            // 4. Avatar fetch
            async function getAvatarBuffer(uid) {
                let token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
                if (api && typeof api.getAccessToken === "function") {
                    try { const botToken = api.getAccessToken(); if (botToken) token = botToken; } catch (e) {}
                }
                const urls = [
                    `https://graph.facebook.com/v18.0/${uid}/picture?height=720&width=720&access_token=${token}`,
                    `https://graph.facebook.com/${uid}/picture?type=large&redirect=true`
                ];
                for (const url of urls) {
                    try {
                        const buf = await fetchBuffer(url);
                        if (buf && buf.length > 3000) return buf;
                    } catch (err) { continue; }
                }
                return await fetchBuffer("https://i.imgur.com/2z8P61i.png");
            }

            // 5. Load bg + avatar
            let bgBuffer;
            try {
                bgBuffer = await fetchBuffer("https://i.imgur.com/u59X6K7.jpeg");
            } catch (e) {
                bgBuffer = await fetchBuffer("https://drive.google.com/uc?export=download&id=1DYTuzqh7gv3KOGZWnkBY_dNu2nHnD-Js");
            }

            const [victimAvatarBuffer, kickerAvatarBuffer] = await Promise.all([
                getAvatarBuffer(targetID),
                getAvatarBuffer(kickerID)
            ]);

            // 6. Canvas e bosano
            const bgImg = await loadImage(bgBuffer);
            const victimImg = await loadImage(victimAvatarBuffer);
            const kickerImg = await loadImage(kickerAvatarBuffer);
            const canvas = createCanvas(bgImg.width, bgImg.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(bgImg, 0, 0);

            // Victim
            ctx.save();
            ctx.beginPath();
            ctx.arc(250, 420, 70, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(victimImg, 180, 350, 140, 140);
            ctx.restore();

            // Kicker
            ctx.save();
            ctx.beginPath();
            ctx.arc(550, 200, 70, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(kickerImg, 480, 130, 140, 140);
            ctx.restore();

            if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });
            cachePath = path.join(cacheFolder, `usta_${Date.now()}.png`);
            fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));

            return message.reply({
                body: `🦶 উস্তা খাইলো: ${targetName}`,
                attachment: fs.createReadStream(cachePath)
            }, () => fs.unlinkSync(cachePath));

        } catch (err) {
            console.error("USTA Error:", err);
            if (cachePath && fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            return message.reply("× ছবি বানাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        }
    }
};
