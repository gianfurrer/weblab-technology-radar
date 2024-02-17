import { Router } from "express";
import { TechologyRouterV1 } from "./technologyRoutes";
import { AuthenticationRouterV1 } from "./authenticationRoutes";

const router = Router();

router.route("/").get((req, res) => {
  res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
});

router.use("/technologies", TechologyRouterV1);
router.use("/auth", AuthenticationRouterV1);

export const RouterV1 = router;
