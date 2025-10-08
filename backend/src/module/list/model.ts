import { t } from "elysia";

export namespace ListModel {
  export const validateAddList = {
    body: t.Object({
      list: t.Object({
        title: t.String({
          maxLength: 100,
        }),
        date: t.Number(),
      }),
    }),
  };

  export const validateUpdateList = {
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

  export const validateDeleteList = {
    body: t.Object({
      id: t.Number(),
    }),
  };
}