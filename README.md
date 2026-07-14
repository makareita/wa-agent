# WA Agent — ИИ-агент для WhatsApp

ИИ-агент на базе Claude API (с tool use) для WhatsApp через Twilio Sandbox.
Умеет: искать ответы в базе знаний (FAQ), проверять доступное время для звонка,
сохранять заявки (лидов).

## Структура проекта

```
wa-agent/
  server.js      — сервер, принимает webhook от Twilio
  agent.js       — логика агента (Claude API + tool use цикл)
  tools.js       — реализация инструментов (create_lead, check_availability, search_faq)
  memory.js      — хранение истории диалога по номеру пользователя
  package.json
  .env.example   — шаблон переменных окружения
```


