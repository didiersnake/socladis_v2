import { object, string, TypeOf } from "zod";

export const createEmptySoreSchema = object({
  body: object({
    team: string({
      required_error: "team name is required",
    }),
    plastic: string({
      required_error: "plastic category is required",
    }),
    bottle: string({
      required_error: "bottle is required",
    }),
    cashier: string({
      required_error: "cashier is required",
    }),
    date: string({
      required_error: "date quantity is required",
    }),
    format: string({
      required_error: "format unitPrice is required",
    }),
  })
});


export type CreateEmptySoreInput = TypeOf<typeof createEmptySoreSchema>["body"];



