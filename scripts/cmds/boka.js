module.exports = {
    config: {
        name: "boka",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        countDown: 3,
        role: 0,
        shortDescription: "Boka banay dey 😂",
        category: "FUN",
        guide: "{pn} (reply someone)"
    },

    onStart: async function ({ api, event }) {
        try {
            if (!event.messageReply) {
                return api.sendMessage("⚠ Boka bananor jonno age kauke reply de!", event.threadID, event.messageID);
            }

            const targetID = event.messageReply.senderID;
            const targetName = await api.getUserInfo(targetID);
            const name = targetName[targetID].name;

            const bokaLines = [
                `🤡 ${name} ekta boro boka 😂`,
                `🧠 ${name} er mathay buddhi nai, shob gobor`,
                `😆 ${name} = certified boka`,
                `🤦 ${name} tui je ki, allah e jane`,
                `😂 Boka of the year: ${name}`
            ];

            const rand = bokaLines[Math.floor(Math.random() * bokaLines.length)];
            return api.sendMessage(rand, event.threadID, event.messageID);

        } catch (err) {
            return api.sendMessage("❌ Error hoise!", event.threadID, event.messageID);
        }
    }
};
