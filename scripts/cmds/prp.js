const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "prp_cache.json");
function getUsed() { try{return JSON.parse(fs.readFileSync(cacheFile))}catch{return[]} }
function saveUsed(url) { let used = getUsed(); used.push(url); if(used.length>100) used=used.slice(-100); fs.writeFileSync(cacheFile, JSON.stringify(used)); }

module.exports = {
    config: {
        name: "prp",
        version: "1.1",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "ANIME",
        guide: "{pn} - Male Anime Aesthetic PFP"
    },

    onStart: async function ({ api, event }) {
        const apis = [
            "https://api.waifu.pics/sfw/male",
            "https://api.waifu.pics/sfw/aesthetic",
            "https://nekos.best/api/v2/waifu" // backup
        ];

        try {
            let used = getUsed();
            let img = null;

            for(let url of apis) {
                try{
                    let res = await axios.get(url, {timeout: 8000});
                    img = res.data.url || res.data.results?.[0]?.url;
                    if(img &&!used.includes(img)) break;
                }catch{}
            }

            if(!img) return api.sendMessage("❌ API gula off ase. 2 min por try koro", event.threadID, event.messageID);

            saveUsed(img);
            const stream = await axios.get(img, {responseType: "stream"});

            const captions = ["👑 Sigma Male PFP", "😎 Attitude Level 999", "🔥 Cold Aesthetic"];
            const cap = captions[Math.floor(Math.random() * captions.length)];

            return api.sendMessage({body: `${cap}`, attachment: stream.data}, event.threadID, event.messageID);

        } catch(e) {
            return api.sendMessage("❌ Error: "+e.message, event.threadID, event.messageID);
        }
    }
};
