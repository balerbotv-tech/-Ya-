const axios = require("axios");

module.exports = {
    config: {
        name: "adminmention",
        version: "20.4.0",
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
        countDown: 0,
        role: 0,
        shortDescription: "Fast caption + random image reply",
        category: "system"
    },

    onStart: async function () {},

    onChat: async function ({ event, message }) {
        const admins = [
            { uid: "61582149885357", names: ["@Ariyan", "@aruu bb'z", "@ariyan bb'z"] },
            { uid: "61582149885357", names: ["@Ariyan Boss", "@boss"] }
        ];

        const senderID = String(event.senderID);
        if (admins.some(a => a.uid === senderID)) return;

        const text = (event.body || "").toLowerCase();
        const mentionedIDs = event.mentions? Object.keys(event.mentions) : [];

        const isMentioning = admins.some(admin =>
            mentionedIDs.includes(admin.uid) ||
            admin.names.some(name => text.includes(name.toLowerCase()))
        );

        if (!isMentioning) return;

        // ✍️ captions
        const captions = [
            "Mantion_দি্ঁস্ঁ না্ঁ আরি্য়া্ঁন্ ব্ঁস্ঁ এ্ঁর্ঁ ম্ঁন্ঁ ভা্ঁলো্ঁ নে্ঁই্ঁ আ্ঁস্কে্ঁ-!💔🥀",
          " ওরে মেনশন দিস না বউ নিয়া চিপায় গেছে 😩🐸",
      "বস এক আবাল তুমারে ডাকতেছে 😂😏",
      " বুকাচুদা তুই মেনশন দিবি না আমার বস রে 🥹",
      "মেনশন দিছস আর বেচে যাবি? দারা বলতাছি 😠",
      "Boss এখন বিজি আছে 😌🥱"
            "- আ্ঁমা্ঁর্ঁ ব্ঁস্ঁ আরি্য়া্ঁন্ এ্ঁর্ঁ সা্ঁথে্ঁ কে্ঁউ্ঁ সে্ঁক্স্ঁ ক্ঁরে্ঁ না্ঁ থুক্কু্ু্ঁ টে্ঁক্স্ঁ ক্ঁরে্ঁ না্ঁহ্ঁ🫂💔",
            "👉আ্ঁমা্ঁর্ঁ ব্ঁস্ঁ আরি্য়া্ঁন্ এ্ঁখ্ঁন্ঁ বি্ঁজি্ঁ আ্ঁছে্ঁ । তা্ঁর্ঁ ই্ঁন্ঁব্ঁক্সে্ঁ এ্ঁ মে্ঁসে্ঁজ্ঁ দি্ঁয়ে্ঁ রা্ঁখো্ঁ",
            "ব্ঁস্ঁ আরি্য়া্ঁন্ কে্ঁ এ্ঁত্ঁ মে্ঁন্ঁশ্ঁন্ঁ না্ঁ দি্ঁয়ে্ঁ ব্ঁক্স্ঁ আ্ঁসো্ঁ হ্ঁট্ঁ ক্ঁরে্ঁ দি্ঁবো্ঁ🤷‍ঝাং 😘🥒",
            "আরি্য়া্ঁন্ ব্ঁস্ঁ এ্ঁখ্ঁন্ঁ বি্ঁজি্ঁ জা্ঁ ব্ঁলা্ঁর্ঁ আ্ঁমা্ঁকে্ঁ ব্ঁল্ঁতে্ঁ পা্ঁরে্ঁন্ঁ_!!😼🥰",
            "ব্ঁস্ঁ আরি্য়া্ঁন্ কে্ঁ মে্ঁন্ঁশ্ঁন্ঁ দি্ঁস্ঁনা্ঁ পা্ঁর্ঁলে্ঁ এ্ঁক্ঁটা্ঁ জি্ঁ এ্ঁফ্ঁ দে্ঁ"
        ];

        const caption = `
✿•≫───────────────≪•✿
『 ${captions[Math.floor(Math.random() * captions.length)]} 』
✿•≫──────────────
