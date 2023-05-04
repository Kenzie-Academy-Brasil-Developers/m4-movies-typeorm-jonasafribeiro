import { Request, Response } from "express";
import moviesServices from "../services/movies.service";
import { tMovie, tMovieList } from "../interfaces/movies.interfaces";

const moviesControllers = {
  post: async (req: Request, res: Response) => {
    const { body: data } = req;

    const createdMovie: tMovie = await moviesServices.post({ data });

    return res.status(201).json(createdMovie);
  },
  get: async (req: Request, res: Response) => {
    const perPage = req.query.perPage as string | undefined;
    const page = req.query.page as string | undefined;

    const allMovies: tMovieList = await moviesServices.getAll({ req });

    return res.status(200).json(allMovies);
  },
  patch: async (req: Request, res: Response) => {
    const { body: data } = req;
    const id = Number(req.params.id);

    const updatedMovie: tMovie = await moviesServices.patch({ data, id });

    return res.status(200).json(updatedMovie);
  },
  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    await moviesServices.delete({ id });

    return res.status(204).send();
  },
};

export default moviesControllers;
