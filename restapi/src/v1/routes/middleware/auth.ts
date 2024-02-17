import { Role } from "@src/types/authentication.types";
import { NextFunction, Request, Response } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  console.log(req.session);
  if (req.session.user) {
    next();
  } else {
    res.status(403).json({ errors: ["Unauthorized"] });
    res.end();
  }
}

export function hasRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user && roles.includes(req.session.user.role)) {
      next();
    } else {
      res.status(403).json({ errors: ["Unauthorized"] });
      res.end();
    }
  };
}
