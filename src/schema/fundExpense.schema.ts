import { object, string, TypeOf } from "zod";

export const createFundExpenseSchema = object({
  body: object({
    modif: string({
      required_error: "FundExpense is required",
    }),
    amount: string({
      required_error: "FundExpense is required",
    }),
    bank: string({
      required_error: "FundExpense is required",
    }),
    date: string({
      required_error: "FundExpense is required",
    }),
  })
});


export type CreateFundExpenseInput = TypeOf<typeof createFundExpenseSchema>["body"];



