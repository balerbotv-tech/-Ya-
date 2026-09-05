module.exports = {
    config: {
        name: "aruuboss",
        version: "1.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        category: "FUN",
        shortDescription: "Aruu bb'z mention korle gali dey"
    },

    onStart: async function() {},

    onChat: async function ({ api, event, Users }) {
        const msg = event.body ? event.body.toLowerCase() : "";
        const senderName = await Users.getNameUser(event.senderID);

        // Jodi kew "aruu bb'z" likhe
        if (msg.includes("aruu bb'z") || msg.includes("aruu bbz") || msg.includes("aruu boss")) {
            
            const replies = [
                `😡 Kire bukacuda ${senderName} Aruu boss re mention des kn?`,
                `🙄 ${senderName} Aruu boss busy ase, pore msg de gadha`,
                `😤 Boss bow ke somoy dicche, disturb koris na ${senderName}`,
                `🤫 ${senderName} chup! Boss vabir kase sob bole dibo`,
                `😂 ${senderName} tui mone hoy kheye kaj nai? Aruu boss ke jalas`
            ];

            const rand = replies[Math.floor(Math.random() * replies.length)];
            return api.sendMessage(rand, event.threadID, event.messageID);
        }
    }
};
