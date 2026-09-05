const fs = require("fs");
const path = "./balance.json";

module.exports = {
    config: {
        name: "bet",
        version: "1.1",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "GAME",
        guide: "{pn} <amount>"
    },
    onStart: async function ({ api, event, args }) {
        if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
        let data = JSON.parse(fs.readFileSync(path));
        const uid = event.senderID;
        if (!data[uid]) data[uid] = 1000;

        const amount = parseInt(args[0]);
        if (!amount || amount < 10) return api.sendMessage("⚠ Min bet: 10 tk", event.threadID, event.messageID);
        if (data[uid] < amount) return api.sendMessage(`❌ Balance nai! Tomar ase: ${data[uid]} tk`, event.threadID, event.messageID);

        const win = Math.random() < 0.6; // 60% win chance

        if (win) {
            const winAmount = amount * 2;
            data[uid] += amount; // profit = bet amount
            fs.writeFileSync(path, JSON.stringify(data));
            return api.sendMessage(`💸 TUMI JITSO! 🎉\nProfit: +${amount} tk\n💰 New Balance: ${data[uid]} tk`, event.threadID, event.messageID);
        } else {
            data[uid] -= amount;
            fs.writeFileSync(path, JSON.stringify(data));
            return api.sendMessage(`😭 TUMI HARCHO!\nLoss: -${amount} tk\n💰 New Balance: ${data[uid]} tk`, event.threadID, event.messageID);
        }
    }
};
