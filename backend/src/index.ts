import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { addTodoList, deleteList, getList, updateList } from "./controller";
import { TodoListFormatted, TodoListInput } from "./interface";

const validateAddList = {
  body: t.Object({
    list: t.Object({
      title: t.String({
        maxLength: 100,
      }),
      date: t.Number(),
    }),
  }),
};

const validateUpdateList = {
  body: t.Object({
    list: t.Object({
      id: t.Number(),
      title: t.String({
        maxLength: 100,
      }),
      date: t.Number(),
    }),
  }),
};
const validateDeleteList = {
  body: t.Object({
    id: t.Number()
  }),
};

//Route
const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia World")
  .post("/api/add", ({ body }) => {
    const listInput: TodoListInput = body.list;
    return addTodoList(listInput);

  }, validateAddList)
  .get("/api/getList", () => {
    return getList();

  })
  .post("/api/update", ({ body }) => {
    const listInput: TodoListInput = body.list;
    return updateList(listInput);

  }, validateUpdateList)
  .post("/api/delete", ({ body }) => {
    return deleteList(body.id)

  }, validateDeleteList)
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
