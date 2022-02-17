exports.get404 = async (req, res, next) => {
  try {
    res.status(404).send();
  } catch (err) {
    next(err);
  }
};

exports.get500 = (req, res, next) => {
  return res.status(500).send();
};
