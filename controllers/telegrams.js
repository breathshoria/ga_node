const Telegram = require('../models/telegram');

exports.addNewTgUser = async (req, res, next) => {
  try {
    console.log(req.body)
    await Telegram.create({
      chat_id: req.body.chat_id,
      token: req.body.token,
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err)
    next(err);
  }
};

exports.getAllTelegrams = async (req, res, next) => {
  try {
    const allUsers = await Telegram.find();
    res.status(200).send({
      users: allUsers || null,
    });
  } catch (err) {
    next(err);
  }
};

exports.editInitForm = async (req, res, next) => {
  try {
    const editUser = await Telegram.findById(req.params.id);
    res.render('editTelegram', {
      user: editUser,
      pageTitle: 'Editing page',
    });
  } catch (err) {
    next(err);
  }
};

exports.editTelegram = async (req, res, next) => {
  try {
    const user = await Telegram.findById(req.params.id);
    user.chat_id = req.body.chat_id;
    user.token = req.body.token;
    await user.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

exports.deleteTelegram = async (req, res, next) => {
  try {
    await Telegram.deleteOne({_id: req.params.id } );
    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
};
