import { NextFunction, Request, Response } from "express";
import AppError from "../error";
import { ZodTypeAny } from "zod";
import moviesServices from "../services/movies.service";
import { tMovie } from "../interfaces/movies.interfaces";

const moviesMiddlewares = {
  checkId: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result: tMovie | null = await moviesServices.getById({
      id: Number(req.params.id),
    });

    if (!result) {
      throw new AppError("Movie not found", 404);
    }

    return next();
  },
  checkName: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.body.name) {
      return next();
    }

    const result: tMovie | null = await moviesServices.getByName({
      name: req.body.name,
    });

    if (result) {
      throw new AppError("Movie already exists.", 409);
    }

    return next();
  },
  validateBody:
    (schema: ZodTypeAny) =>
    (req: Request, _res: Response, next: NextFunction): void => {
      const validatedBody = schema.parse(req.body);

      req.body = validatedBody;

      return next();
    },
};

export default moviesMiddlewares;
