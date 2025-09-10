import { Elysia } from "elysia";
import { GristDocAPI } from "grist-api";

import { addTodoList } from "./controller";

//Grist access
const gristUrl = Bun.env["GRIST_DOC_URL"]!;
if (!gristUrl) {
  throw new Error("Missing GRIST_DOC_URL in environment variables");
}
const api = new GristDocAPI(gristUrl);


// const DateToGristDate = (date: string): number => {
//   return Math.floor(jsDate.getTime() / 1000);
// }


// await api.updateRecords('Todo', [
//   {Title: 'eggsUpdate', Description: "12", id:2 },
// ])

const data = await api.fetchTable('Todo');


console.log('first>>>', data)

//Route
const app = new Elysia()
.get("/", () => "Hello Elysia World")
.post("/test", ({body}) => addTodoList(body!))
.listen(5000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
