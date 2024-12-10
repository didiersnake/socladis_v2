import { object, string, TypeOf } from "zod";

export const createAchatSchema = object({
  body: object({
    name: string({
      required_error: "achat name is required",
    }),
    invoice_number: string({
      required_error: "invoice is required",
    }),
    quantity: string({
      required_error: "achat quantity is required",
    }),
    date: string({
      required_error: "achat date is required",
    }),
    purchase_type: string({
      required_error: "purchase type date is required",
    }),
  }),
});


export type CreateAchatInput = TypeOf<typeof createAchatSchema>["body"];



