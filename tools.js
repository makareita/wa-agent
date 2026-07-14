// tools.js
// Здесь описаны "инструменты" — функции, которые ИИ-агент может сам решить вызвать.
// Именно это отличает агента от простого чат-бота: модель сама решает,
// когда и какой инструмент использовать, в каком порядке, и может вызвать
// несколько инструментов подряд перед финальным ответом.

const tools = [
  {
    name: "create_lead",
    description:
      "Сохранить заявку (лид) клиента в базу/CRM. Использовать, когда клиент " +
      "проявил конкретный интерес — оставил контакты, попросил созвон, " +
      "или явно хочет заказать услугу.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Имя клиента, если известно" },
        phone: { type: "string", description: "Номер телефона клиента" },
        need: {
          type: "string",
          description: "Что именно интересует клиента (кратко)",
        },
      },
      required: ["phone", "need"],
    },
  },
  {
    name: "check_availability",
    description:
      "Проверить свободные слоты для звонка/консультации на этой неделе.",
    input_schema: {
      type: "object",
      properties: {
        day: {
          type: "string",
          description: "День недели, например 'вторник' (необязательно)",
        },
      },
      required: [],
    },
  },
  {
    name: "search_faq",
    description:
      "Поиск ответа в базе знаний компании по ключевым словам " +
      "(цены, сроки, услуги, стек технологий и т.д.).",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Вопрос или ключевые слова" },
      },
      required: ["query"],
    },
  },
];

// Реализация функций. Тут заготовки — вместо console.log можно подключить
// реальную Google Sheets API, Airtable, свою CRM и т.д.
async function executeTool(name, input) {
  switch (name) {
    case "create_lead": {
      console.log("📋 Новый лид сохранён:", input);
      // TODO: тут можно записывать в Google Sheets / Airtable / CRM
      return {
        status: "ok",
        message: "Лид сохранён, менеджер свяжется в ближайшее время",
      };
    }

    case "check_availability": {
      // Заглушка — тут можно подключить реальный Google Calendar API
      return { slots: ["10:00", "14:00", "17:30"] };
    }

    case "search_faq": {
      const faq = {
        "цена": "Стоимость разработки от 500 000 тг, зависит от объёма проекта",
        "стоимость": "Стоимость разработки от 500 000 тг, зависит от объёма проекта",
        "сроки": "Средний срок разработки MVP — 3-4 недели",
        "стек": "Используем Node.js/Python на бэкенде, React на фронтенде, Claude API для ИИ-решений",
        "услуги": "Разработка сайтов, мобильных приложений, ИИ-агентов и автоматизаций",
      };

      const query = (input.query || "").toLowerCase();
      const foundKey = Object.keys(faq).find((key) => query.includes(key));

      return {
        answer: foundKey
          ? faq[foundKey]
          : "Точного ответа в базе знаний нет, лучше уточнить у менеджера",
      };
    }

    default:
      return { error: `Неизвестный инструмент: ${name}` };
  }
}

module.exports = { tools, executeTool };
