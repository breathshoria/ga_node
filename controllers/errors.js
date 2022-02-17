exports.get404 = async (req, res, next) => {
  try {
    res.status(404).render('404');
  } catch (err) {
    next(err);
  }
};

exports.get500 = (req, res, next) => {
  if (req.method === 'POST') {
    return res.send('Server error');
  }
  return res.status(500).render('500');
};
