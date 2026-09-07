const axios = require('axios');
const baseApiUrl = async () => { return "https://noobs-api.top/dipto"; };

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe", "bot"],
  version: "7.0.1",
  author: "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇",
  countDown: 0,
  role: 0,
  description: "better then all simi",
  category: "chat",
  guide: { en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]... OR\nlist OR\nremove [YourMessage]" }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;
  let command, comd, final;

  try {
    if (!args[0]) {
      const ran = [ "Hmm bolo babu 😘", "Yes jan ki korte pari? 💙" ];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }
    if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
      const res = await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`);
      const dat = res.data?.message || "❌ রিমুভ করা সম্ভব হয়নি!";
      return api.sendMessage(dat, event.threadID, event.messageID);
    }
    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
      const res = await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`);
      const da = res.data?.message || "❌ রিমুভ করতে সমস্যা হয়েছে!";
      return api.sendMessage(da, event.threadID, event.messageID);
    }
    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const data = (await axios.get(`${link}?list=all`)).data;
        const limit = parseInt(args[2]) || 100;
        const limited = data?.teacher?.teacherList?.slice(0, limit) || [];
        const teachers = await Promise.all(limited.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const name = await usersData.getName(number).catch(() => number) || "Not found";
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
        return api.sendMessage(`Total Teach = ${data.length || 0}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const d = (await axios.get(`${link}?list=all`)).data;
        return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
      }
    }
    if (args[0] === 'msg') {
      const fuk = dipto.replace("msg ", "");
      const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`)).data.data;
      return api.sendMessage(`Message ${fuk} = ${d || "No data"}`, event.threadID, event.messageID);
    }
    if (args[0] === 'edit') {
      const parts = dipto.split(/\s*-\s*/);
      const command = parts[1];
      if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      const dA = (await axios.get(`${link}?edit=${encodeURIComponent(args[1])}&replace=${encodeURIComponent(command)}&senderID=${uid}`)).data.message;
      return api.sendMessage(`changed ${dA || "failed"}`, event.threadID, event.messageID);
    }
    if (args[0] === 'teach' && args[1]!== 'amar' && args[1]!== 'react') {
      [comd, command] = dipto.split(/\s*-\s*/);
      if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      final = comd.replace("teach ", "");
      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}&threadID=${event.threadID}`);
      const tex = re.data.message;
      const teacher = "𝗔𝗿𝗶𝘆𝗮𝗻 𝗯𝗯'𝘇"; // Tor name ekhane
      return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }
    if (args[0] === 'teach' && args[1] === 'amar') {
      [comd, command] = dipto.split(/\s*-\s*/);
      if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      final = comd.replace("teach ", "");
      const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }
    if (args[0] === 'teach' && args[1] === 'react') {
      [comd, command] = dipto.split(/\s*-\s*/);
      if (!command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
      final = comd.replace("teach react ", "");
      const tex = (await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`)).data.message;
      return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
    }
    if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
      const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
      return api.sendMessage(data || "I don't know your name yet!", event.threadID, event.messageID);
    }
    const response = await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}`);
    const d = response.data?.reply || "সরি, আমি বুঝতে পারিনি!";
    api.sendMessage(d, event.threadID, (error, info) => {
      if (info && info.messageID) {
        global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID, d, apiUrl: link });
      }
    }, event.messageID);
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ সার্ভারে কোনো সমস্যা হচ্ছে!", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try {
    if (event.type === "message_reply") {
      const userMsg = event.body? event.body.toLowerCase() : "";
      const response = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(userMsg)}&senderID=${event.senderID}`);
      const a = response.data?.reply || "উফ, বুঝতে পারিনি!";
      await api.sendMessage(a, event.threadID, (error, info) => {
        if (info && info.messageID) {
          global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID, a });
        }
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.onChat = async ({ api, event, message }) => {
  try {
    const body = event.body? event.body.toLowerCase().trim() : "";
    if (!body) return;

    const name = await api.getUserInfo(event.senderID).then(data => data[event.senderID].name);

    // PREFIX OFF SYSTEM
    const triggers = ["bby", "bot", "bby bot", "baby", "bbe", "babe"];

    if (triggers.includes(body) || triggers.some(word => body === word)) {
      const randomReplies = [
        `Hae ${name} ami ekhane asi 💌`,
        `Ki bby? dakso keno 🥺`,
        `Bolo jan ki help lagbe 😘`,
        `Ami tor bot. Kisu lagbe? 👑`,
        `Ji bolo bby ❤️`
      ];
      const replyMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      return message.reply(replyMsg);
    }

    // Purano system - ekhan theke Rasel bad disi
    if (body.startsWith("babyhi") || body.startsWith("bbyhi") || body.startsWith("bothi") || body.startsWith("@heli lumo") || body.startsWith("babuhi") || body.startsWith("januhi")) {
      const arr = body.replace(/^\S+\s*/, "").trim();
      const randomReplies = [
        "এত ডাকাডাকি করিস কেন? Ariyan Boss–এর bot আমি 😉 💙", // Rasel bad
        "Yes 😀, I am here",
        "What's up?",
        "Bolo jaan ki korte pari tumar jonno",
        "হাসো তো প্লিজ 🌸, Ariyan চাইছে তোমার মুখে আবার সেই সুন্দর হাসিটা দেখতে 🙂💙" // Rasel bad
      ];
      if (!arr) {
        const replyMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        await api.sendMessage(replyMsg, event.threadID, (error, info) => {
          if (info && info.messageID && global.GoatBot?.onReply) {
            global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID });
          }
        }, event.messageID);
        return;
      }
      const response = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}`);
      const a = response.data?.reply || "হুম, শুনছি!";
      await api.sendMessage(a, event.threadID, (error, info) => {
        if (info && info.messageID && global.GoatBot?.onReply) {
          global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID, a });
        }
      }, event.messageID);
    }
  } catch (err) {
    console.error(err);
  }
};
