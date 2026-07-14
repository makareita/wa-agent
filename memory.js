// memory.js
// Простое хранение истории диалога в памяти процесса (для демо/MVP).
// В продакшене замени на Redis или Postgres, т.к. эта память
// обнуляется при перезапуске сервера.

const conversations = {};

function getHistory(userId) {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }
  return conversations[userId];
}

function addMessage(userId, role, content) {
  const history = getHistory(userId);
  history.push({ role, content });

  // Ограничиваем историю, чтобы не раздувать контекст бесконечно
  if (history.length > 40) {
    history.splice(0, history.length - 40);
  }
}

module.exports = { getHistory, addMessage };
