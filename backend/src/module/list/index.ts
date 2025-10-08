import { Elysia } from 'elysia';
import { TodoListInput } from "../../interface/list.interface";
import { addTodoList, deleteList, getList, updateList } from './service';
import { ListModel } from './model';

export const listRoutes = (app: Elysia) =>
    app.group('/list', app =>
        app
            .post("/add", ({ body }) => {
                const listInput: TodoListInput = body.list;
                return addTodoList(listInput);

            }, ListModel.validateAddList)
            .get("/get", () => {
                return getList();

            })
            .post("/update", ({ body }) => {
                const listInput: TodoListInput = body.list;
                return updateList(listInput);

            }, ListModel.validateUpdateList)
            .post("/delete", ({ body }) => {
                return deleteList(body.id)

            }, ListModel.validateDeleteList)
    );