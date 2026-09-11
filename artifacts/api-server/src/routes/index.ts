import { Router, type IRouter } from "express";
import healthRouter from "./health";
import complaintsRouter from "./complaints";
import campusRouter from "./campus";
import dashboardRouter from "./dashboard";

import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(complaintsRouter);
router.use(campusRouter);
router.use(dashboardRouter);
router.use(aiRouter);

export default router;
