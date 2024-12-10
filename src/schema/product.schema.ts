import { object, string, TypeOf,array } from "zod";


const salePriceSchema = object({
  grossiste: string({
      required_error: "product grossiste is required",
  }),
  Semi_grossiste: string({
      required_error: "Semi_grossiste is required",
  }),
  detaillant: string({
      required_error: "detaillant is required",
  }),
  random: string({
      required_error: "random is required",
  }),
});

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: "product name is required",
    }),
    category: string({
      required_error: "product category is required",
    }),
    format: string({
      required_error: "product format is required",
    }),
    unitPrice: string({
      required_error: "product unitPrice is required",
    }),
    sale_price: array(salePriceSchema),

  })
});


export type CreateProductInput = TypeOf<typeof createProductSchema>["body"];



