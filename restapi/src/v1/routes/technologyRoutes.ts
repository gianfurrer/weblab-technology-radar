import { NextFunction, Request, Response, Router } from "express";
import { ValidationChain, body, validationResult } from "express-validator";
import {
  createTechnology,
  getTechnologies,
  publishTechnology,
  updateTechnology,
} from "@src/controllers/technologyController";
import { Category, Ring } from "@src/types/technology.types";
import { hasRole, isAuthenticated } from "./middleware/auth";
import { Role } from "@src/types/authentication.types";

const router = Router();

const validate = (checks: ValidationChain[]) => [
  ...checks,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

const ringOptions = Object.values(Ring);
const categoryOptions = Object.values(Category);

const requiredTechnologyValidator = [
  body("name", `Parameter 'name' not provided`).notEmpty(),
  body("category", `Parameter 'category' not provided`)
    .notEmpty()
    .isIn(categoryOptions)
    .withMessage(`Parameter 'category' must be one of: ${categoryOptions.join(", ")}`),
  body("description").notEmpty(),
];
const technologyValidator = [
  body("id", `Parameter 'id' not provided`),
  ...requiredTechnologyValidator,
  body("ring").optional()
    .isIn(ringOptions)
    .withMessage(`Parameter 'ring' must be one of: ${ringOptions.join(", ")}`),
  body("ring_reason").optional(),
  body("published").default(false),
];

const publishValidator = [
  body("id", `Parameter 'id' not provided`),
  body("ring", `Parameter 'ring' not provided`)
    .notEmpty()
    .isIn(ringOptions)
    .withMessage(`Parameter 'ring' must be one of: ${ringOptions.join(", ")}`),
  body("ring_reason").notEmpty(),
];

router.get("/", isAuthenticated, getTechnologies);
router.post("/", hasRole([Role.CTO, Role.TechLead]), validate(technologyValidator), createTechnology);
router.put("/", hasRole([Role.CTO, Role.TechLead]), validate(requiredTechnologyValidator), updateTechnology);
router.post("/publish", hasRole([Role.CTO, Role.TechLead]), validate(publishValidator), publishTechnology);

export const TechologyRouterV1 = router;
