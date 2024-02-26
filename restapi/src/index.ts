import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { RouterV1 } from './v1/routes';
import { pool } from './database/database';

export const app = express();
const PORT = process.env.PORT || 3000;

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(corsOptions)); // FIXME: ONLY FOR DEVELOPMENT
const pgSession = connectPg(session);
app.use(
  session({
    store: new pgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET || 'technology-radar-secret',
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', RouterV1);

app.get('/', (req, res) => {
  res.redirect('/api/v1');
});

export const server = app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
