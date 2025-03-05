import { Hono } from "hono";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { customerRouter } from "./customers";

export const app = new Hono();

app.use(logger());
app.use(trimTrailingSlash());
app.route("/customer", customerRouter);
