import { object, string, TypeOf } from "zod";

export const createStockSchema = object({
  body: object({
    name: string({
      required_error: "stock name is required",
    }),
    category: string({
      required_error: "stock category is required",
    }),
    format: string({
      required_error: "stock format is required",
    }),
    quantity: string({
      required_error: "stock quantity is required",
    }),
    unitPrice: string({
      required_error: "stock unitPrice is required",
    }),
    status: string({
      required_error: "stock status is required",
    }),
    productId: string({
      required_error: "stock productId is required",
    }),
  })
});


export type CreateStockInput = TypeOf<typeof createStockSchema>["body"];



