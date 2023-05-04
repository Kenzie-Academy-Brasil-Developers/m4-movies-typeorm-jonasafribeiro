import { z } from "zod";

const movieSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  description: z.string().nullish(),
  duration: z.number().int().positive(),
  price: z.number().int().positive(),
});

const movieSchemaCreate = movieSchema.omit({
  id: true,
});

const movieSchemaUpdate = movieSchemaCreate.partial();

export { movieSchema, movieSchemaCreate, movieSchemaUpdate };
