import { object, array, string, TypeOf,optional } from "zod";

const productSchema = object({
  name: string({
      required_error: "product name is required",
  }),
  price: string({
      required_error: "price is required",
  }),
  quantity: string({
      required_error: "quantity is required",
  }),
  total: string({
      required_error: "total is required",
  }),
});

const paymentSchema = object({
  cash: string({
      required_error: "cash is required",
  }),
  credit: string({
      required_error: "credit is required",
  }),
  ristourn: string({
      required_error: "ristourn is required",
  }),
  emballages: string({
      required_error: "emballages is required",
  }),
});

export const createSalesSchema = object({
  body: object({
    clientName: string({
      required_error: "sales clientName is required",
    }),
    products: array(productSchema),
    total_without_tax: string({
      required_error: "sales total_without_tax is required",
    }),
    VAT_amount: string({
      required_error: "sales VAT_amount is required",
    }),
    withdrawal_amount: string({
      required_error: "sales withdrawal_amount is required",
    }),
    total_with_tax: string({
      required_error: "sales total_with_tax is required",
    }),
    ristourne: string({
      required_error: "sales ristourne is required",
    }),
    status: string({
      required_error: "sales status is required",
    }),
    date: string({
      required_error: "date status is required",
    }),
    createdBy: string({
      required_error: "createdBy status is required",
    }),
    invoice_number: string({
      required_error: "invoice_number status is required",
    }),
    payment_method: optional(array(paymentSchema)),
  }),
});


export type CreateSalesInput = TypeOf<typeof createSalesSchema>["body"];



