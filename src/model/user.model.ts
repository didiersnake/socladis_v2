import mongoose,{Document,Schema,model,connect} from 'mongoose'
import {customAlphabet }from 'nanoid'


const nanoid = customAlphabet('0123456789', 5)


export interface IUser {
    name: string;
    category: string;
    phone: string;
    location: string;
    group: string;
    tax_system:string;
    roles:string;
    password:string;
    uniqueCode:string;


}

export interface IUserModel extends IUser,Document {}


export const UserSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true},
    category: { type: String},
    phone: { type: String},
    location: { type: String, required: true },
    group: { type: String},
    tax_system: { type: String },
    roles: { type: String,default:()=>"EMPLOYEE" },
    password: { type: String},
    uniqueCode: { type: String},


  });
  

  export default mongoose.model<IUserModel>('User',UserSchema)

