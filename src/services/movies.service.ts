import { Request, Response } from "express";
import AppError from "../error";
import { Repository } from "typeorm";
import { Movie } from "../entities";
import { AppDataSource } from "../data-source";
import {
  tMovieUpdate,
  tMovie,
  tMovieCreate,
  tMovieList,
  tFindObj,
} from "../interfaces/movies.interfaces";
import { any } from "zod";

const moviesServices = {
  post: async (payload: { data: tMovieCreate }): Promise<tMovie> => {
    const moviesRepository: Repository<Movie> =
      AppDataSource.getRepository(Movie);

    const movie: tMovie = moviesRepository.create(payload.data);
    await moviesRepository.save(movie);

    return movie;
  },
  getAll: async (payload: { req: Request }): Promise<tMovieList> => {
    let take: number = Number(payload.req.query.perPage) || 5;
    let skip: number = Number(payload.req.query.page) || 1;
    let sort = payload.req.query.sort as "price" | "duration" | undefined;
    let order = payload.req.query.order as "asc" | "desc" | undefined;

    if (take <= 0 || take > 5) {
      take = 5;
    }
    if (skip <= 0) {
      skip = 1;
    }

    const moviesRepository: Repository<Movie> =
      AppDataSource.getRepository(Movie);

    let findObj: any = {
      take,
      skip: (skip - 1) * take,
      order: {},
    };

    if (sort) {
      if (sort === "duration") {
        findObj.order.duration = order ?? "asc";
      } else {
        findObj.order.price = order ?? "asc";
      }
    }

    const totalMovies: number = await moviesRepository.count();
    const movies: tMovie[] = await moviesRepository.find(findObj);

    const createPage = (page: number) => {
      return `http://localhost:3000/movies?page=${page}&perPage=${take}`;
    };

    const nextPage =
      totalMovies - skip * take > 0 ? createPage(skip + 1) : null;
    const prevPage = skip > 1 ? createPage(skip - 1) : null;

    const moviesResult: tMovieList = {
      count: totalMovies,
      data: movies,
      nextPage,
      prevPage,
    };

    return moviesResult;
  },
  patch: async (payload: {
    data: tMovieUpdate;
    id: number;
  }): Promise<tMovie> => {
    const moviesRepository: Repository<Movie> =
      AppDataSource.getRepository(Movie);

    const oldMovie = await moviesServices.getById({ id: payload.id });

    const newMovie: tMovie = moviesRepository.create({
      ...oldMovie,
      ...payload.data,
    });
    await moviesRepository.save(newMovie);

    return newMovie;
  },
  delete: async (payload: { id: number }): Promise<void> => {
    const moviesRepository: Repository<Movie> =
      AppDataSource.getRepository(Movie);

    await moviesRepository.delete(payload.id);

    return;
  },
  getById: async (payload: { id: number }): Promise<tMovie | null> => {
    const moviesRepository: Repository<Movie> =
      AppDataSource.getRepository(Movie);

    const movie: tMovie | null = await moviesRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    return movie;
  },
  getByName: async (payload: { name: string }): Promise<tMovie | null> => {
    const moviesRepository: Repository<Movie> =
      AppDataSource.getRepository(Movie);

    const movie: tMovie | null = await moviesRepository.findOne({
      where: {
        name: payload.name,
      },
    });

    return movie;
  },
};

export default moviesServices;
