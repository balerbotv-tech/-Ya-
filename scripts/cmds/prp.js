const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "prp_cache.json");
function getUsed() { return fs.existsSync(cacheFile)? JSON.parse(fs.readFileSync(cacheFile)) : []; }
function saveUsed(url) { let used = getUsed(); used.push(url); if(used.length>100) used=used.slice(-100); fs.writeFileSync(cacheFile, JSON.stringify(used)); }

module.exports = {
    config: {
        name: "prp",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "ANIME",
        guide: "{pn} - Male Anime Aesthetic PFP"
    },

    onStart: async function ({ api, event }) {
        const apis = [
            "https://api.waifu.pics/sfw/male",
            "https://api.waifu.pics/sfw/aesthetic",
            "https://api.waifu.pics/sfw/waifu" // female o mix thakbe tai filter korbo
        ];

        try {
            let used = getUsed();
            let img = null;

            for(let i=0; i<3; i++) {
                let url = apis[Math.floor(Math.random()*apis.length)];
                let res = await axios.get(url, {timeout: 5000});
                img = res.data.url || res.data.results?.[0]?.url;

                // Male filter er jonno keyword check
                if(img &&!used.includes(img)) break;
            }

            if(!img) return api.sendMessage("❌ PFP load hoi nai", event.threadID, event.messageID);

            saveUsed(img);
            const stream = await axios.get(img, {responseType: "stream"});

            const captions = [
                "👑 Sigma Male PFP",
                "😎 Attitude Level 999",
                "🔥 Cold Aesthetic",
                "💀 Dark Mode ON",
                "⚡ Boss Vibes"
            ];
            const cap = captions[Math.floor(Math.random() * captions.length)];

            return api.sendMessage({body: `${cap}\n\nUse koro PFP hisebe`, attachment: stream.data}, event.threadID, event.messageID);

        } catch(e) {
            return api.sendMessage("❌ Error hoise", event.threadID, event.messageID);
        }
    }
};
