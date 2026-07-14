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

## Шаг 1. Установка зависимостей

```bash
npm install
```

## Шаг 2. Настройка переменных окружения

Скопируй `.env.example` в `.env`:

```bash
cp .env.example .env
```

Заполни значения:

- `ANTHROPIC_API_KEY` — получить на https://console.anthropic.com/settings/keys
- `TWILIO_SID` и `TWILIO_AUTH` — в Twilio Console на главной странице (Account Dashboard)
- `TWILIO_WHATSAPP_NUMBER` — номер твоего Twilio Sandbox (обычно `whatsapp:+14155238886`, но сверься в своей консоли)

## Шаг 3. Запуск локально

```bash
npm start
```

Сервер поднимется на порту 3000 (или том, что указан в `.env`).

## Шаг 4. Публичный URL для теста (ngrok)

Twilio должен достучаться до твоего сервера через интернет. Локально это делается через ngrok:

```bash
ngrok http 3000
```

Скопируй URL вида `https://xxxx.ngrok-free.app` и в Twilio Console:

1. Messaging → Try it out → Send a WhatsApp message → вкладка **Sandbox settings**
2. В поле **"When a message comes in"** впиши:
   ```
   https://xxxx.ngrok-free.app/webhook
   ```
3. Метод — **POST**
4. Нажми **Save**

## Шаг 5. Подключение к Sandbox с телефона

Напиши с личного WhatsApp на номер Twilio Sandbox (например `+1 415 523 8886`)
сообщение вида:

```
join <твой-код-фразы>
```

Код фразы смотри в разделе Sandbox — там же, где указан номер.

## Шаг 6. Тест

Напиши боту любой вопрос, например:

```
Сколько стоит разработка сайта?
```

Агент вызовет `search_faq`, найдёт ответ и пришлёт его. Попробуй также:

```
Хочу созвон, меня зовут Аян, мой номер +7...
```

Агент проверит доступное время (`check_availability`) и сохранит заявку (`create_lead`).

## Продакшн-деплой (Railway / Render)

1. Залей проект на GitHub
2. Создай проект на railway.app или render.com, подключи репозиторий
3. Пропиши те же переменные окружения в настройках проекта (Environment Variables)
4. После деплоя получишь постоянный публичный URL — впиши его в Twilio Sandbox
   вместо ngrok-ссылки (ngrok-ссылки временные и меняются при каждом перезапуске)

## Как расширять

Чтобы добавить новый инструмент агенту:

1. Опиши его в `tools.js` в массиве `tools` (name, description, input_schema)
2. Добавь его реализацию в функцию `executeTool`
3. Всё — модель сама начнёт решать, когда его вызывать, основываясь на описании

## Важно для демо

- Текущая память (`memory.js`) хранится в оперативной памяти процесса и
  обнуляется при перезапуске сервера — для демонстрации этого достаточно,
  для продакшена стоит подключить Redis или Postgres.
- `search_faq`, `check_availability`, `create_lead` — сейчас это заглушки
  с тестовыми данными. Для реального проекта подключи туда Google Sheets API,
  Google Calendar API, свою CRM и т.д.
# wa-agent
# wa-agent
# wa-agent
