import { Router } from "express";
import moviesControllers from "../controllers/movies.controller";
import moviesMiddlewares from "../middlewares/movies.middleware";
import {
  movieSchemaCreate,
  movieSchemaUpdate,
} from "../schemas/movies.schemas";

const moviesRouter: Router = Router();

moviesRouter.post(
  "",
  moviesMiddlewares.validateBody(movieSchemaCreate),
  moviesMiddlewares.checkName,
  moviesControllers.post
);

moviesRouter.get("", moviesControllers.get);

moviesRouter.patch(
  "/:id",
  moviesMiddlewares.validateBody(movieSchemaUpdate),
  moviesMiddlewares.checkId,
  moviesMiddlewares.checkName,
  moviesControllers.patch
);

moviesRouter.delete(
  "/:id",
  moviesMiddlewares.checkId,
  moviesControllers.delete
);

export default moviesRouter;
