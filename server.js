// server.js
// Точка входа. Принимает webhook от Twilio (входящее сообщение WhatsApp),
// прогоняет его через агента и отправляет ответ обратно пользователю.

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const { runAgent } = require("./agent");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// Простой health-check — удобно проверить, что сервер вообще жив
app.get("/", (req, res) => {
  res.send("WA Agent server is running ✅");
});

// Сюда Twilio присылает входящие сообщения WhatsApp (POST запрос)
app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.Body;
    const userNumber = req.body.From; // формат: whatsapp:+7...

    console.log(`📩 Входящее от ${userNumber}: ${userMessage}`);

    if (!userMessage || !userNumber) {
      return res.sendStatus(400);
    }

    // Сразу отвечаем Twilio 200 OK, чтобы не было таймаута,
    // а сам ответ агента отправим отдельным сообщением через API
    res.sendStatus(200);

    const reply = await runAgent(userNumber, userMessage);

    console.log(`📤 Ответ агента: ${reply}`);

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: userNumber,
      body: reply,
    });
  } catch (err) {
    console.error("❌ Ошибка в обработке webhook:", err);
    // res.sendStatus уже отправлен выше, поэтому просто логируем
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`   Локальный webhook: http://localhost:${PORT}/webhook`);
});
