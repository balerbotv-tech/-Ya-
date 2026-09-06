const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Mᴏʜᴀᴍᴍᴀᴅ Aᴋᴀsʜ",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 亗^⁠_^𝗔_𝗥_𝗜_𝗬_𝗔_⁠𝗡^_^ 𝐁𝐁'𝐙 ✿᭄
│🧸 Nɪᴄᴋ       : AruuuH
│ 🎂 Aɢᴇ        : 19+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Married 
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Business 
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : chudling pong 
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : Dhaka keraniganj 
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  : https://facebook.com/61582149885357
│ 💬 messenger : m.me/aruuhbbz
│ 📞 WhatsApp  : wa.me/01704471566
╰────────────────╯`;

   const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/KmX1XZp.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};


