import { object, string, TypeOf } from "zod";

export const loginSessionSchema = object({
    body: object({
      name: string({
        required_error: "Username is required",
      }),
      password: string({
        required_error: "Password is required",
      }).min(6, "Invalid email or password"),
    }),
  });
  
  export type LoginSessionInput = TypeOf<typeof loginSessionSchema>["body"];
