// src/server/index.ts

import express from 'express';
import session from 'express-session';

import compression from 'compression';
import { api } from './api';
import { auth } from './auth';
import { initNodeRed } from './node-red';
import { search } from './search';
const app = express();
app.use(compression());
app.use(
  session({
    secret: '27AD3F06-7582-4443-9680-AB6DBB618E53',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(api);
app.use(auth);
app.use(search);
const server = app.listen(6002, () => {
  console.log('Server started');
});

initNodeRed(server, app);
