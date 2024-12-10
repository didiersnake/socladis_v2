import { object, string, TypeOf } from "zod";

export const createSupplyBoxSchema = object({
  body: object({
    income_source: string({
      required_error: "income source is required",
    }),
    amount: string({
      required_error: "amount is required",
    }),
    date: string({
      required_error: "date is required",
    }),
  })
});


export type CreateSupplyBoxInput = TypeOf<typeof createSupplyBoxSchema>["body"];



