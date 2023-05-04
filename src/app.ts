import "express-async-errors";
import express, { Application, json } from "express";
import moviesRouter from "./routes/movies";
import error from "./middlewares/errorhandle.middleware";

const app: Application = express();
app.use(json());

app.use("/movies", moviesRouter);

app.use(error);

export default app;
