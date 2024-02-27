import connectPg from 'connect-pg-simple';
import express from 'express';
import session from 'express-session';
import { pool } from './database/database';
import { logger } from './logger';
import { RouterV1 } from './v1/routes';


/** SETUP APP */
export const app = express();
const PORT = process.env.PORT || 3000;

/** Setup Session Management with PostgreSQL */
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

/** Setup Response Parser and Routes */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', RouterV1);

export const server = app.listen(PORT, () => {
  logger.info(`API is listening on port ${PORT}`);
});
