const fs = require("fs");
const path = "./balance.json";

module.exports = {
    config: {
        name: "slot",
        version: "1.1",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "GAME",
        guide: "{pn} <bet_amount>"
    },
    onStart: async function ({ api, event, args }) {
        if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
        let data = JSON.parse(fs.readFileSync(path));
        const uid = event.senderID;
        if (!data[uid]) data[uid] = 1000;

        const bet = parseInt(args[0]) || 50;
        if (data[uid] < bet) return api.sendMessage(`❌ Tomar kase ${data[uid]} tk ase. ${bet} tk nai!`, event.threadID, event.messageID);

        const emojis = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];
        let roll = Math.random();
        let result;

        if (roll < 0.3) { // 30% jackpot
            const winEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            result = [winEmoji, winEmoji, winEmoji];
        } else {
            result = [emojis[Math.floor(Math.random()*6)], emojis[Math.floor(Math.random()*6)], emojis[Math.floor(Math.random()*6)]];
        }

        const isWin = result[0] === result[1] && result[1] === result[2];

        if (isWin) {
            const win = bet * 3;
            data[uid] += win;
            fs.writeFileSync(path, JSON.stringify(data));
            return api.sendMessage(`🎰 [ ${result.join(" | ")} ]\n🎉 JACKPOT!!!\nTumi jitso: ${win} tk\n💰 New Balance: ${data[uid]} tk`, event.threadID, event.messageID);
        } else {
            data[uid] -= bet;
            fs.writeFileSync(path, JSON.stringify(data));
            return api.sendMessage(`🎰 [ ${result.join(" | ")} ]\n😭 Harso: ${bet} tk\n💰 New Balance: ${data[uid]} tk`, event.threadID, event.messageID);
        }
    }
};
