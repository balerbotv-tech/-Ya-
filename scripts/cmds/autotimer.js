const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "autotimer",
    version: "5.6",
    role: 0,
    author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇", // <-- tor nam
    description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে",
    category: "AutoTime",
    countDown: 4,
};

module.exports.onLoad = async function ({ api }) {
    const timerData = {
        "12:00 AM": { text: "⌚┆এখন রাত ১২টা বাজে❥︎খাউয়া দাউয়া করে নেউ,🍽️🍛", video: "https://files.catbox.moe/8btwbx.mp4" },
        "01:00 AM": { text: "⌚┆এখন রাত ১টা বাজে❥︎সবাই শুয়ে পড়ো,🌌💤", video: "https://files.catbox.moe/9iq1ki.mp4" },
        "02:00 AM": { text: "⌚┆এখন রাত ২টা বাজে❥︎প্রেম না কইরা যাইয়া ঘুমা বেক্কল,😾🌠", video: "https://files.catbox.moe/g9zf5c.mp4" },
        "03:00 AM": { text: "⌚┆এখন রাত ৩টা বাজে❥︎যারা ছ্যাকা খাইছে তারা জেগে আছে,🫠🌃", video: "https://files.catbox.moe/siojtf.mp4" },
        "04:30 AM": { text: `╭━━━〔 🌅 𝐅𝐀𝐉𝐑 • ফজরের সময় 〕━━━╮\n﴾ ﷽ ﴿ اَلصَّلَاةُ خَيْرٌ مِّنَ النَّوْمِ 🤲\nআর কিছুক্ষণ পর ফজরের নামাজের সময় হবে। 🕌\nসবাই অজু করে নামাজের জন্য প্রস্তুতি নিন।\nاللَّهُمَّ اجْعَلْنَا مِنَ الْمُقِيمِينَ لِلصَّلَاةِ\n╰━━━━━━━━━━━━━━━━━━━━╯`, video: "https://files.catbox.moe/ee9khu.mp4" },
        "06:00 AM": { text: "⌚┆এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই,🌞☕", video: "https://files.catbox.moe/q9rf0f.mp4" },
        "07:00 AM": { text: "⌚┆এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও,🍞", video: "https://files.catbox.moe/ztnm6a.mp4" },
        "08:00 AM": { text: "⌚┆এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে,🌤️✨", video: "https://files.catbox.moe/tb5xef.mp4" },
        "09:00 AM": { text: "⌚┆এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই!🕘", video: "https://files.catbox.moe/2mi5oo.mp4" },
        "10:00 AM": { text: "⌚┆এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি,🌞☀️", video: "https://files.catbox.moe/q2vg9i.mp4" },
        "11:00 AM": { text: "⌚┆এখন সকাল ১টা বাজে❥︎কাজ চালিয়ে যাও!😌", video: "https://files.catbox.moe/zzm2xo.mp4" },
        "12:00 PM": { text: "⌚┆এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে,❤️", video: "https://files.catbox.moe/g8d1av.mp4" },
        "01:00 PM": { text: `╭━━━〔 🕌 𝐙𝐔𝐇𝐑 • যোহরের সময় 〕━━━╮\n﴾ ﷽ ﴿ حَيَّ عَلَى الصَّلَاةِ 🤲\nআর কিছুক্ষণ পর যোহরের নামাজের সময় হবে। 🕌\nসবাই নামাজের জন্য প্রস্তুতি নিন।\nرَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ\n╰━━━━━━━━━━━━━━━━━━━━╯`, video: "https://files.catbox.moe/c5qbek.mp4" },
        "02:00 PM": { text: "⌚┆এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো?🍛🌤️", video: "https://files.catbox.moe/nstu8b.mp4" },
        "03:00 PM": { text: "⌚┆এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো,🧑‍🔧☀️", video: "https://files.catbox.moe/xmrujv.mp4" },
        "04:30 PM": { text: `╭━━━〔 🕌 𝐀𝐒𝐑 • আসরের সময় 〕━━━╮\n﴾ ﷽ ﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا 🤲\nআর কিছুক্ষণ পর আসরের নামাজের সময় হবে। 🕌\nসবাই নামাজের জন্য প্রস্তুতি নিন।\nاللَّهُمَّ تَقَبَّلْ مِنَّا\n╰━━━━━━━━━━━━━━━━━━━━╯`, video: "https://files.catbox.moe/vcgbxq.mp4" },
        "06:30 PM": { text: `╭━━━〔 🌇 𝐌𝐀𝐆𝐇𝐑𝐈𝐁 • মাগরিবের সময় 〕━━━╮\n﴾ ﷽ ﴿ الله أكبر، الله أكبر 🤲\nআর কিছুক্ষণ পর মাগরিবের নামাজের সময় হবে। 🕌\nসবাই অজু করে নামাজের জন্য প্রস্তুতি নিন।\nاللَّهُمَّ تَقَبَّلْ مِنَّا\n╰━━━━━━━━━━━━━━━━━━━━╯`, video: "https://files.catbox.moe/y8pnz7.mp4" },
        "08:00 PM": { text: `╭━━━〔 🌙 𝐈𝐒𝐇𝐀 • এশার সময় 〕━━━╮\n﴾ ﷽ ﴿ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ 🤲\nআর কিছুক্ষণ পর এশার নামাজের সময় হবে। 🕌\nসবাই নামাজের জন্য প্রস্তুতি নিন।\nآمِين يَا رَبَّ الْعَالَمِينَ\n╰━━━━━━━━━━━━╯`, video: "https://files.catbox.moe/rpnut9.mp4" },
        "09:00 PM": { text: "⌚┆এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও,😴🌙", video: "https://files.catbox.moe/sxs5io.mp4" },
        "10:00 PM": { text: "⌚┆এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে,😴🙂↕️", video: "https://files.catbox.moe/0e4s7h.mp4" },
        "11:00 PM": { text: "⌚┆এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো,🥰🌌", video: "https://files.catbox.moe/ndbhtu.mp4" }
    };

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    if (!global.__sentMap) global.__sentMap = {};
    if (!global.autoTimerConfig) global.autoTimerConfig = {};

    const checkTimeAndSend = async () => {
        try {
            const now = moment().tz("Asia/Dhaka").format("hh:mm A");
            if (!timerData[now]) return;

            const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
            const key = `${todayDate}_${now}`;
            if (global.__sentMap[key]) return;
            global.__sentMap[key] = true;

            const { text, video } = timerData[now];
            const videoName = now.replace(/[: ]/g, "_") + ".mp4";
            const videoPath = path.join(cacheDir, videoName);

            if (!fs.existsSync(videoPath)) {
                try {
                    console.log(`[AUTOTIMER] Downloading video for ${now}...`);
                    const res = await axios.get(video, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, Buffer.from(res.data));
                } catch (e) {
                    console.error("Video download error:", e);
                    return;
                }
            }

            // সব গ্রুপে পাঠানো
            const allThreads = await api.getThreadList(100, null, ["INBOX"]);
            for (const thread of allThreads) {
                if (thread.isGroup && global.autoTimerConfig[thread.threadID]!== false) {
                    try {
                        await api.sendMessage({
                            body: text,
                            attachment: fs.createReadStream(videoPath)
                        }, thread.threadID);
                        await new Promise(r => setTimeout(r, 2000));
                    } catch (e) {
                        console.error("Send error:", e);
                    }
                }
            }
            console.log(`[AUTOTIMER] Sent message for ${now}`);

        } catch (err) {
            console.error("AutoTimer Error:", err);
        }
    };

    // প্রতি 30 সেকেন্ডে চেক করবে
    setInterval(checkTimeAndSend, 30000);
    console.log("[AUTOTIMER] AutoTimer Loaded Successfully by 𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇");
};

module.exports.onStart = async function ({ api, event, args }) {
    const tid = event.threadID;
    if (!global.autoTimerConfig) global.autoTimerConfig = {};

    if (args[0] === "on") {
        global.autoTimerConfig[tid] = true;
        return api.sendMessage("✅ AutoTimer ON for this group", tid);
    }
    if (args[0] === "off") {
        global.autoTimerConfig[tid] = false;
        return api.sendMessage("❌ AutoTimer OFF for this group", tid);
    }
    return api.sendMessage("Use: autotimer on / autotimer off", tid);
};
