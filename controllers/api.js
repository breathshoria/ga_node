const axios = require('axios');
const Telegram = require('../models/telegram');

const BOT_MESSAGES = [
  'Таски на главной. Беги за компьютер',
  'Пора на работу. Включай компьютер',
  'Тебя уже ждут на главной. Открывай хаб',
  'Ch-ch-changes',
  'Опять работа',
];

const API_METHOD = 'sendMessage';

const message = (task, buttons) => {
  const date = new Date();
  let body = `Accepted Task: ${task.type} | AET: ${task.aet}\n${date.toLocaleString()}\n\nTasks List:\n`;
  buttons.forEach((button, i) => {
    body += `${i + 1}) ${button.type}\nToken: <a href="${button.url}">Link</a>\n\n`;
  });
  return body;
};

exports.notify = async (req, res, next) => {
  try {
    const chatId = req.body.chat_id;
    const notifyMode = req.body.mode;
    const user = await Telegram.findOne({ where: { chat_id: chatId } });
    if (!user || user.token.split(':')[1].length !== 35) {
      return res.send('Wrong credentials :(');
    }
    const response = await axios.post(`https://api.telegram.org/bot${user.token}/${API_METHOD}`, {
      chat_id: user.chat_id,
      parse_mode: 'Markdown',
      text: `${notifyMode}: ${BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)]}`,
    });
    return res.send(response.data.ok);
  } catch (err) {
    return next(err);
  }
};

exports.sendTasks = async (req, res, next) => {
  try {
    const chatId = req.body.chat_id;
    const fetchedButtons = req.body.buttons;
    const fetchedTask = req.body.task;
    const user = await Telegram.findOne({ where: { chat_id: chatId } });
    if (!user || user.token.split(':')[1].length !== 35 || !fetchedTask) {
      return res.send('Wrong credentials or empty task');
    }
    const response = await axios.post(`https://api.telegram.org/bot${user.token}/${API_METHOD}`, {
      chat_id: user.chat_id,
      parse_mode: 'HTML',
      disable_web_page_preview: 'true',
      text: message(fetchedTask, fetchedButtons),
    });
    return res.send(response.data.ok);
  } catch (err) {
    return next(err);
  }
};
