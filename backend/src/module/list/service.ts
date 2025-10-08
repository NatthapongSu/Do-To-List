import { IRecord } from "grist-api";
import { gristApi } from "../../gristApi";
import { TodoListInput } from "../../interface/list.interface"; 

export const addTodoList = async (listInput: TodoListInput) => {
  try {
    const list: IRecord[] = [];

    list.push({
      Title: listInput.title,
      Date: listInput.date,
    });

    const data = await gristApi.addRecords("Todo", list);

    return { success: true, list: data };
  } catch (error) {
    console.error("Error adding todo list:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateList = async (listInput: TodoListInput) => {
  try {
    const list: IRecord[] = [];

    list.push({
      id: listInput.id!,
      Title: listInput.title,
      Date: listInput.date,
    });
    
    const data = await gristApi.updateRecords("Todo", list);
    return { success: true, list: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const deleteList = async (id: number) => {
  try {

    await gristApi.deleteRecords('Todo', [id]);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const getList = async () => {
  try {
    const data = await gristApi.fetchTable("Todo");
    return { success: true, list: data };
  } catch (error) {
    console.error("Error adding todo list:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
