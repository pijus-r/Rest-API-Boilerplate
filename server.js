import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import users from './routes/users';
import movies from './routes/movies';
// DB configuration
import mongoose from './config/database';
import jwt from 'jsonwebtoken';
const app = express();

app.set('secretKey', 'nodeRestApi'); // jwt secret token

// connection to mongodb
mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:'),
);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.json({rest_api: 'Rest API with Node, JWT authentication and Express'});
});

// Public route
app.use('/users', users);

// Private route
app.use('/movies', validateUser, movies);
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
});

function validateUser(req, res, next) {
  jwt.verify(
    req.headers['x-access-token'],
    req.app.get('secretKey'),
    (err, decoded) => {
      if (err) {
        res.json({status: 'error', message: err.message, data: null});
      } else {
        // Add User ID to the request
        req.body.userId = decoded.id;
        next();
      }
    },
  );
}

// Express doesn't consider 404 as an error so we need to handle it explicitly
app.use((req, res, next) => {
  let err = new Error('Not found.');
  err.status = 404;
  next(err);
});

// Handle errors
app.use((err, req, res, next) => {
  console.log(err);

  if (err.status === 404) res.status(404).json({message: 'Not found.'});
  else res.status(500).json({message: 'Something went wrong'});
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
