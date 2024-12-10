import { object, array, string, TypeOf,optional } from "zod";

const productSchema = object({
  name: string({
      required_error: "product name is required",
  }),
  quantity: string({
      required_error: "quantity is required",
  }),
  format: string({
    required_error: "format is required",
}),
});

export const createChargementSchema = object({
  body: object({
    products: array(productSchema),
    date: string({
      required_error: "date is required",
    }),
    team:optional(string({
      required_error: "team is required",
    }))
  })
});


export type CreateChargementInput = TypeOf<typeof createChargementSchema>["body"];



