import { object,array, string, TypeOf } from "zod";


const userSchema = object({
    userId: string({
        required_error: "User Identification number is required",
    }),
    userName: string({
        required_error: "userName is required",
    }),
  });
  

export const createGroupSchema = object({
  body: object({
    name: string({
      required_error: "group name is required",
    }),
    members: array(userSchema),
    date: string({
      required_error: "group date is required",
    }),
    createdBy: string({
      required_error: "group creator is required",
    }),
    updatedBy: string({
      required_error: "group update is required",
    }),
  }),
});


export type CreateGroupInput = TypeOf<typeof createGroupSchema>["body"];



