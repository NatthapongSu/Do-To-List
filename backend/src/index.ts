import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { listRoutes } from "./module/list";

//Route
const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia World")
  .use(listRoutes);

app.listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
