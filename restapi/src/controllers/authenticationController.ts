import { NextFunction, Request, Response } from "express";
import * as service from "@src/services/authenticationService";
import { Account } from "@src/types/authentication.types";

export async function login(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    res.status(204).send(`You're already logged in as '${req.session.user.email}`);
    res.end();
    return;
  }

  try {
    const account: Account = await service.login(req.body["email"], req.body["password"]);

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = account;
      req.session.save();

      res.send(req.session.id);
    });
  } catch (error) {
    res.status(500).send({ errors: [error.message] });
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.send("Successfully logged out.");
    });
  });
}
