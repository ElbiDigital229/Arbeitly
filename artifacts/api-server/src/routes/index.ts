import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enhanceRouter from "./enhance";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enhanceRouter);

export default router;
