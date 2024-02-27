import { logger } from '@src/logger';
import * as service from '@src/services/authenticationService';
import { Account } from '@src/types/authentication.types';
import { NextFunction, Request, Response } from 'express';


export async function login(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    res.status(200).send(req.session.user);
    res.end();
    return;
  }

  const { email, password } = req.body;

  try {
    const account: Account = await service.login(email, password);

    logger.info(`User ${account.email} with Role '${account.role}' just logged in.`);

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = account;
      req.session.save();

      res.status(200).send(account);
    });
  } catch (error) {
    if (error instanceof service.AuthenticationError) {
      logger.info(`Login attempt with email '${email}' failed`)
      return res.status(401).send(error.message);
    }
    return res.status(500).send(error.message);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.send({ message: 'Successfully logged out.' });
    });
  });
}

export function getUser(req: Request, res: Response) {
  res.status(200).send(req.session.user);
}
