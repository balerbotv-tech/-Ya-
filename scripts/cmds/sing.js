const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const BASE_URL_FILE =
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json";

async function getBaseApiUrl() {
    const res = await axios.get(BASE_URL_FILE, { timeout: 15000 });

    // Supports both:
    // { "mahmud": "https://example.com" }
    // and:
    // { "mahmud": ["https://example.com"] }
    const value = res.data?.mahmud;

    if (Array.isArray(value)) {
        const url = value.find(Boolean);
        if (!url) throw new Error("No API URL found");
        return String(url).replace(/\/+$/, "");
    }

    if (typeof value === "string" && value.trim()) {
        return value.trim().replace(/\/+$/, "");
    }

    throw new Error("Invalid baseApiUrl.json format");
}

module.exports = {
    config: {
        name: "song",
        version: "3.0.9",
        author: "Ariyan",
        countDown: 5,
        role: 0,

        description: {
            bn: "ইউটিউব থেকে গান ডাউনলোড করুন",
            en: "Download songs/audio from YouTube",
            vi: "Tải nhạc từ YouTube"
        },

        category: "music",

        guide: {
            bn: "{pn} [গানের নাম বা YouTube লিংক]\nউদাহরণ: {pn} tui chinli na amay",
            en: "{pn} [song name or YouTube link]\nExample: {pn} stay justin bieber",
            vi: "{pn} [tên bài hát hoặc link]\nVí dụ: {pn} see you again"
        }
    },

    langs: {
        bn: {
            error: "❌ | সমস্যা হয়েছে: %1",
            noResult: '⭕ | "%1" এর জন্য কোনো গান পাওয়া যায়নি।',
            choose: "🎵 গানের তালিকা:\n\n%1\n\n👉 ১-%2 এর মধ্যে একটি নম্বর রিপ্লাই দিন।",
            success: "✅ | ডাউনলোড সম্পন্ন: %1",
            downloading: "⏳ | গান ডাউনলোড হচ্ছে..."
        },
        en: {
            error: "❌ | An error occurred: %1",
            noResult: '⭕ | No results found for "%1".',
            choose: "🎵 Song Results:\n\n%1\n\n👉 Reply with a number from 1-%2.",
            success: "✅ | Successfully downloaded: %1",
            downloading: "⏳ | Downloading the song..."
        }
    },

    onStart: async function ({
        api,
        args,
        event,
        commandName,
        getLang
    }) {
        const { threadID, messageID, senderID } = event;
        const input = args.join(" ").trim();

        if (!input) {
            return api.sendMessage(
                "🎵 | Please provide a song name or YouTube link.",
                threadID,
                messageID
            );
        }

        let apiUrl;

        try {
            apiUrl = await getBaseApiUrl();
        } catch (e) {
            return api.sendMessage(
                getLang("error", "Base API পাওয়া যাচ্ছে না।"),
                threadID,
                messageID
            );
        }

        const videoID = extractYouTubeId(input);

        api.setMessageReaction("⏳", messageID, () => {}, true);

        // Direct YouTube URL
        if (videoID) {
            return handleDownload(
                api,
                threadID,
                messageID,
                videoID,
                apiUrl,
                getLang
            );
        }

        try {
            const res = await axios.get(
                `${apiUrl}/api/ytb/search`,
                {
                    params: { q: input },
                    timeout: 30000
                }
            );

            const rawResults = res.data?.results;

            if (!Array.isArray(rawResults) || rawResults.length === 0) {
                api.setMessageReaction("❌", messageID, () => {}, true);

                return api.sendMessage(
                    getLang("noResult", input),
                    threadID,
                    messageID
                );
            }

            const results = rawResults
                .filter(item => item && (item.id || item.videoId))
                .slice(0, 6);

            if (!results.length) {
                return api.sendMessage(
                    getLang("noResult", input),
                    threadID,
                    messageID
                );
            }

            let msg = "";
            const attachments = [];
            const cacheDir = path.join(__dirname, "cache");

            await fs.ensureDir(cacheDir);

            for (let i = 0; i < results.length; i++) {
                const item = results[i];

                const title =
                    item.title ||
                    item.name ||
                    "Unknown Song";

                const time =
                    item.time ||
                    item.duration ||
                    item.length ||
                    "Unknown";

                msg += `${i + 1}. ${title}\n⏱️ ${time}\n\n`;

                if (item.thumbnail) {
                    try {
                        const thumbPath = path.join(
                            cacheDir,
                            `song_thumb_${senderID}_${Date.now()}_${i}.jpg`
                        );

                        const thumbRes = await axios.get(
                            item.thumbnail,
                            {
                                responseType: "arraybuffer",
                                timeout: 15000
                            }
                        );

                        await fs.writeFile(
                            thumbPath,
                            Buffer.from(thumbRes.data)
                        );

                        attachments.push(
                            fs.createReadStream(thumbPath)
                        );
                    } catch (_) {
                        // Thumbnail is optional.
                    }
                }
            }

            return api.sendMessage(
                {
                    body: getLang(
                        "choose",
                        msg,
                        results.length
                    ),
                    ...(attachments.length
                        ? { attachment: attachments }
                        : {})
                },
                threadID,
                async (err, info) => {
                    for (const stream of attachments) {
                        try {
                            if (stream.path) {
                                await fs.remove(stream.path);
                            }
                        } catch (_) {}
                    }

                    if (!err && info) {
                        global.GoatBot.onReply.set(
                            info.messageID,
                            {
                                commandName,
                                author: senderID,
                                results,
                                apiUrl
                            }
                        );
                    }
                },
                messageID
            );
        } catch (e) {
            api.setMessageReaction("❌", messageID, () => {}, true);

            return api.sendMessage(
                getLang("error", formatError(e)),
                threadID,
                messageID
            );
        }
    },

    onReply: async function ({
        event,
        api,
        Reply,
        getLang
    }) {
        const { results, apiUrl, author } = Reply;

        if (String(event.senderID) !== String(author)) {
            return;
        }

        const choice = parseInt(
            String(event.body).trim(),
            10
        );

        if (
            Number.isNaN(choice) ||
            choice < 1 ||
            choice > results.length
        ) {
            return api.sendMessage(
                `❌ | Please reply with a number from 1-${results.length}.`,
                event.threadID,
                event.messageID
            );
        }

        const selected = results[choice - 1];
        const videoID = selected.id || selected.videoId;

        if (!videoID) {
            return api.sendMessage(
                getLang("error", "Video ID পাওয়া যায়নি।"),
                event.threadID,
                event.messageID
            );
        }

        try {
            api.unsendMessage(Reply.messageID);
        } catch (_) {}

        return handleDownload(
            api,
            event.threadID,
            event.messageID,
            videoID,
            apiUrl,
            getLang
        );
    }
};

function extractYouTubeId(input) {
    const value = String(input).trim();

    const patterns = [
        /(?:youtube\.com\/watch\?[^ ]*v=|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtu\.be\/)([A-Za-z0-9_-]{11})/
    ];

    for (const regex of patterns) {
        const match = value.match(regex);
        if (match) return match[1];
    }

    return null;
}

async function handleDownload(
    api,
    threadID,
    messageID,
    videoID,
    apiUrl,
    getLang
) {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const filePath = path.join(
        cacheDir,
        `song_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 8)}.mp3`
    );

    try {
        api.setMessageReaction("⏳", messageID, () => {}, true);

        const res = await axios.get(
            `${apiUrl}/api/ytb/get`,
            {
                params: {
                    id: videoID,
                    type: "audio"
                },
                timeout: 60000
            }
        );

        const data = res.data?.data || res.data;

        const title =
            data?.title ||
            data?.name ||
            "YouTube Song";

        const downloadLink =
            data?.downloadLink ||
            data?.downloadUrl ||
            data?.download_url ||
            data?.url;

        if (!downloadLink) {
            throw new Error(
                "API audio download link দেয়নি।"
            );
        }

        const response = await axios.get(
            downloadLink,
            {
                responseType: "stream",
                timeout: 180000,
                maxContentLength: 100 * 1024 * 1024,
                maxBodyLength: 100 * 1024 * 1024
            }
        );

        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);

            response.data.pipe(writer);

            writer.on("finish", resolve);
            writer.on("error", reject);
            response.data.on("error", reject);
        });

        const stat = await fs.stat(filePath);

        if (!stat.size) {
            throw new Error("Audio file empty");
        }

        return api.sendMessage(
            {
                body: getLang("success", title),
                attachment: fs.createReadStream(filePath)
            },
            threadID,
            async err => {
                api.setMessageReaction(
                    err ? "❌" : "✅",
                    messageID,
                    () => {},
                    true
                );

                try {
                    await fs.remove(filePath);
                } catch (_) {}
            },
            messageID
        );
    } catch (e) {
        try {
            await fs.remove(filePath);
        } catch (_) {}

        api.setMessageReaction("❌", messageID, () => {}, true);

        return api.sendMessage(
            getLang("error", formatError(e)),
            threadID,
            messageID
        );
    }
}

function formatError(error) {
    if (!error) return "Unknown error";

    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        const message =
            data?.message ||
            data?.error ||
            data?.msg;

        return message
            ? `${status}: ${message}`
            : `API Error: ${status}`;
    }

    if (error.code === "ECONNABORTED") {
        return "Request timeout";
    }

    return error.message || "Unknown error";
        }
