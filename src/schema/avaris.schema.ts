import { object, string, TypeOf } from "zod";

export const createAvarisSchema = object({
  body: object({
    name: string({
      required_error: "avaris name is required",
    }),
    quantity: string({
      required_error: "avaris quantity is required",
    }),
    type: string({
      required_error: "avaris type is required",
    }),
    date: string({
      required_error: "avaris date is required",
    }),
  })
});


export type CreateAvarisInput = TypeOf<typeof createAvarisSchema>["body"];



