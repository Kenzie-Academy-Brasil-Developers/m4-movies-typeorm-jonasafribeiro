import { number, z } from "zod";
import { movieSchema, movieSchemaCreate } from "../schemas/movies.schemas";
import { DeepPartial } from "typeorm";

type tMovie = z.infer<typeof movieSchema>;
type tMovieCreate = z.infer<typeof movieSchemaCreate>;

type tMovieUpdate = DeepPartial<tMovieCreate>;

interface tMovieList {
  count: number;
  data: tMovie[];
  nextPage: string | null;
  prevPage: string | null;
}

interface tFindObj {
  take: number;
  skip: number;
  order?: {
    duration?: string;
    price?: string;
  };
}

export { tMovie, tMovieCreate, tMovieUpdate, tMovieList, tFindObj };
