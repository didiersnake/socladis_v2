import mongoose,{Document,Schema,model,connect} from 'mongoose'
import {customAlphabet }from 'nanoid'



const date = new Date()


export interface IAvaris {
    name: string;
    quantity: string;
    type: string;
    date:string;
    createdBy: string;
    updatedBy: string;
}

export interface IAvarisModel extends IAvaris,Document {}


export const AvarisSchema: Schema = new Schema<IAvaris>({
    name: { type: String, required: true},
    quantity: { type: String, required: true },
    type: { type: String},
    date: { type: String,default:()=>(date.toJSON()).toString() },
    createdBy: { type: String},
    updatedBy: { type: String},
  });
  

  export default mongoose.model<IAvarisModel>('Avaris',AvarisSchema)

