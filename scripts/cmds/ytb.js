const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

const baseApiUrl = async () => {
    const base = await axios.get(`https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json`);
    return base.data.mahmud;
};

module.exports = {
    config: {
        name: "ytb",
        aliases: ["youtube"],
        version: "1.8", 
        author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇", 
        countDown: 5,
        role: 0,
        description: {
            bn: "ইউটিউব থেকে ভিডিও, অডিও ডাউনলোড বা তথ্য দেখুন",
            en: "Download video, audio or view video information from YouTube",
            vi: "Tải video, audio hoặc xem thông tin video trên YouTube"
        },
        category: "media",
        guide: {
            bn: '{pn} video [নাম/লিঙ্ক]: ভিডিও ডাউনলোড করতে\n {pn} audio [নাম/লিঙ্ক]: অডিও ডাউনলোড করতে\n {pn} info [নাম/লিঙ্ক]: ভিডিওর তথ্য দেখতে\n উদাহরণ:\n {pn} -v Mood Lofi\n {pn} -a Mood Lofi',
            en: '{pn} [video|-v] [name|link]: download video\n {pn} [audio|-a] [name|link]: download audio\n {pn} [info|-i] [name|link]: view details',
            vi: '{pn} [video|-v] [tên|link]: tải video\n {pn} [audio|-a] [tên|link]: tải audio\n {pn} [info|-i] [tên|link]: xem thông tin'
        }
    },

    langs: {
        bn: {
            error: "❌ সমস্যা হয়েছে: %1",
            noResult: "⭕ দুঃখিত বেবি, \"%1\" এর জন্য কিছু খুঁজে পাইনি।",
            choose: "%1যা ডাউনলোড করতে চান তার নাম্বার লিখে রিপ্লাই দিন।",
            video: "ভিডিও",
            audio: "অডিও",
            downloading: "⬇️ আপনার কাঙ্ক্ষিত %1 \"%2\" ডাউনলোড হচ্ছে...",
            info: "💠 শিরোনাম: %1\n🏪 চ্যানেল: %2\n👨‍👩‍👧‍👦 সাবস্ক্রাইবার: %3\n⏱ সময়কাল: %4\n👀 ভিউ: %5\n👍 লাইক: %6\n🆙 আপলোড: %7\n🔠 আইডি: %8\n🔗 লিঙ্ক: %9"
        },
        en: {
            error: "❌ An error occurred: %1",
            noResult: "⭕ No search results match the keyword %1",
            choose
