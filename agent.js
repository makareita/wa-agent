// agent.js
// Здесь живёт "мозг" агента: отправляем сообщение в Claude API вместе
// со списком доступных инструментов. Модель сама решает, вызывать ли
// какой-то инструмент, и если да — мы выполняем его и возвращаем результат
// обратно модели. Цикл продолжается, пока модель не даст финальный текстовый ответ.

const Anthropic = require("@anthropic-ai/sdk");
const { tools, executeTool } = require("./tools");
const { getHistory, addMessage } = require("./memory");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Ты — ИИ-агент компании "NextDev", которая занимается разработкой ИТ-проектов.
Твоя задача:
- Консультировать клиентов по услугам компании
- Отвечать на вопросы, используя инструмент search_faq
- Если клиент хочет созвон — проверить доступное время через check_availability
- Если клиент оставил контакты или явно заинтересован — сохранить его через create_lead
- Общайся дружелюбно, кратко и по делу, задавай уточняющие вопросы если нужно
- Не выдумывай информацию, которой нет в базе знаний — в таком случае честно скажи, что уточнишь у менеджера`;

const MODEL = "claude-sonnet-4-5";

async function runAgent(userId, userMessage) {
  addMessage(userId, "user", userMessage);

  const messages = getHistory(userId);
  let finalText = "";

  // Защита от бесконечного цикла — максимум 6 шагов инструментов подряд
  const MAX_STEPS = 6;
  let steps = 0;

  while (steps < MAX_STEPS) {
    steps++;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    const toolCalls = response.content.filter((b) => b.type === "tool_use");

    if (toolCalls.length === 0) {
      // Модель ответила обычным текстом — можно завершать цикл
      finalText = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      addMessage(userId, "assistant", finalText);
      break;
    }

    // Модель хочет вызвать один или несколько инструментов
    messages.push({ role: "assistant", content: response.content });

    const toolResults = [];
    for (const call of toolCalls) {
      console.log(`🔧 Вызов инструмента: ${call.name}`, call.input);
      const result = await executeTool(call.name, call.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: call.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({ role: "user", content: toolResults });
    // Цикл продолжается — модель получит результаты и решит, что делать дальше
  }

  if (!finalText) {
    finalText =
      "Извините, что-то пошло не так при обработке запроса. Попробуйте ещё раз.";
  }

  return finalText;
}

module.exports = { runAgent };
