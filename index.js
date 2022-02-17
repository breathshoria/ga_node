const express = require('express');
const cors = require('cors');
const expHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const errors = require('./controllers/errors');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');

const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs', expHbs.engine({
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
  defaultLayout: 'base',
  extname: 'hbs',
}));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('static'));
app.use('/', userRoutes);
app.use('/api', apiRoutes);
app.use(errors.get404);
app.use((error, req, res, next) => {
  console.log(error);
  errors.get500(req, res, next);
});

(async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    app.listen(port);
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
