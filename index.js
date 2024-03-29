const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const bodyParser = require('body-parser');
const errors = require('./controllers/errors');
const telegramRoutes = require('./routes/telegramRoutes');
const apiRoutes = require('./routes/apiRoutes');
const userRoutes = require('./routes/userRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const cookieParser = require('cookie-parser')
const { authenticateJWT } = require('./utils/verifyJwt')
const mongoose = require("mongoose");
require('dotenv').config()

const port = process.env.PORT || 8000;
const app = express();
const dbHost =
    process.env.NODE_ENV === 'TEST' ?
    process.env.TEST_MONGO_URI :
    process.env.MONGO_URI


const corsConfig = {
  credentials: true,
  origin: true
}

app.use(helmet())
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('static'));
app.use('/', userRoutes);
app.use('/api', apiRoutes);
app.use('/telegram',authenticateJWT, telegramRoutes)
app.use('/tracker', authenticateJWT, trackerRoutes);
app.use(errors.get404);
app.use((error, req, res, next) => {
  errors.get500(req, res, next);
});

(async () => {
  try {
    await mongoose.connect(dbHost, { useNewUrlParser: true })
    app.listen(port);
    console.log('Connection has been established successfully.');
  } catch (error) {
    throw new Error(`Unable to connect to the database: ${error}`);
  }
})();

module.exports.server = app;

