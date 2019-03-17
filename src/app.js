/* eslint-disable import/first */
import { config } from 'dotenv';
config();

import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import winston from './config/winston';
import mongoose from 'mongoose';
import path from 'path';
import favicon from 'serve-favicon';
import cors from 'cors';
import passport from 'passport';
// import { Strategy } from 'passport-local';
const LocalStrategy = require('passport-local').Strategy;
import session from 'express-session';
import { getMongoConnectionString } from './utils/utils';

import SentenceRouter from './routes/SentencesRouter';
import TagsRouter from './routes/TagsRouter';
import ChallengesRouter from './routes/ChallengesRouter';
/* eslint-enable import/first */

// application error handler
process.on('uncaughtException', (err) => {
  winston.error('APPLICATION FAILED ', err);
  process.exit(1);
});

const mandatoryEnv = [
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
  'MONGO_HOST',
  'PORT',
  'SESSION_SECRET',
  'API_USERNAME',
  'API_PASSWORD',
];

winston.debug('Mandatory ENV:');
mandatoryEnv.forEach(x => winston.debug(`${x}: ${process.env[x]}`));

const emptyMandatoryEnv = mandatoryEnv.filter(x => !process.env[x]);
if (emptyMandatoryEnv.length > 0) {
  emptyMandatoryEnv.forEach(x => winston.error(`env ${x} not set`));
  throw new Error('Mandatory Env missing');
}

const optionalEnv = [
  {
    env: 'NODE_ENV',
    default: 'development',
  },
  {
    env: 'BASE_URL',
    default: '',
  },
];

winston.debug('Optional ENV:');
optionalEnv.forEach(x => winston.debug(`${x.env}: ${process.env[x.env]}`));

const emptyOptionalEnv = optionalEnv.filter(x => !process.env[x.env]);
if (emptyOptionalEnv.length > 0) {
  emptyOptionalEnv.forEach(x => winston.warn(`env ${x.env} not set. Using default: ${x.default}`));
}

const {
  PORT,
  SESSION_SECRET,
  API_USERNAME,
  API_PASSWORD,
  BASE_URL = '',
} = process.env;

// ------------- API Node Server Setup -------------
const app = express();
app.set('port', PORT);
app.disable('x-powered-by');
app.use(logger('combined', { stream: winston.stream }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// enable CORS
app.use(cors({
  origin: ['http://localhost:8080', 'https://www.oskarlindgren.se'],
  credentials: true,
}));

passport.use(new LocalStrategy((username, password, done) => {
  if (username === API_USERNAME && password === API_PASSWORD) {
    return done(null, { username, password });
  }
  return done(null, false, { message: 'incorrect auth' });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    req.logIn(req.user, (err) => {
      if (err) {
        throw err;
      }
    });
    res.send({ ok: 1337 });
  },
);

function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    const err = new Error('Unauthenticated');
    err.status = 401;
    throw err;
  }
}

app.use(`${BASE_URL}/sentence`, authenticate, SentenceRouter);
app.use(`${BASE_URL}/challenge`, authenticate, ChallengesRouter);
app.use(`${BASE_URL}/tag`, authenticate, TagsRouter);

// 404
app.use((req, res, next) => {
  winston.debug('404 catcher reached', req.url);
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(`${req.ip} - ${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - `, err);

  // render the error page
  res.status(err.status || 500);
  res.send({
    error: res.locals.error,
    message: res.locals.message,
  });
});

app.listen(app.get('port'), async () => {
  winston.info(`server listen at :${app.get('port')}${BASE_URL}/`);

  // Connect to Mongo
  const mongoConnectionString = getMongoConnectionString();
  winston.info(`connecting to Mongo at ${mongoConnectionString}`);
  try {
    const connected = await mongoose.connect(mongoConnectionString, { useNewUrlParser: true });
    const {
      host,
      name,
      port,
    } = connected.connection;

    winston.info(`connected to mongo db "${name}" at ${host}:${port}`);
  } catch (err) {
    winston.error(`mongo connection failed ${err}`);
  }
});
