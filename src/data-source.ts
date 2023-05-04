import "dotenv/config";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import path = require("path");

const dataSourceConfig = (): DataSourceOptions => {
  const entitiesPatch: string = path.join(__dirname, "./entities/**.{js,ts}");
  const migrationsPatch: string = path.join(
    __dirname,
    "./migrations/**.{js,ts}"
  );

  const dbUrl: string | undefined = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error("Missing var: DATABASE_URL");
  }

  if (process.env.NODE_ENV === "test") {
    return {
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [entitiesPatch],
    };
  }

  return {
    type: "postgres",
    url: dbUrl,
    synchronize: false,
    logging: true,
    entities: [entitiesPatch],
    migrations: [migrationsPatch],
  };
};

const AppDataSource: DataSource = new DataSource(dataSourceConfig());

export { AppDataSource };
