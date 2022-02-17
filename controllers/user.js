const Telegram = require('../models/telegram');

exports.addNewTgUser = async (req, res, next) => {
  try {
    await Telegram.create({
      chat_id: req.body.chat_id,
      token: req.body.token,
    });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

exports.getAddPage = (req, res, next) => {
  try {
    res.render('addTelegram', {
      pageTitle: 'Adding new Telegram User',
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsersPage = async (req, res, next) => {
  try {
    const allUsers = await Telegram.findAll({ raw: true });
    res.render('index', {
      users: allUsers || null,
      pageTitle: 'GA Bot Management',
    });
  } catch (err) {
    next(err);
  }
};

exports.editInitForm = async (req, res, next) => {
  try {
    const editUser = await Telegram.findByPk(req.params.id, { raw: true });
    res.render('editTelegram', {
      user: editUser,
      pageTitle: 'Editing page',
    });
  } catch (err) {
    next(err);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const user = await Telegram.findByPk(req.params.id);
    user.chat_id = req.body.chat_id;
    user.token = req.body.token;
    await user.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await Telegram.destroy({ where: { id: req.params.id } });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};
