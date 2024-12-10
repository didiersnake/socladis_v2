import mongoose,{Document,Schema,model,connect} from 'mongoose'
import {customAlphabet }from 'nanoid'



const date = new Date()


export interface ISupplyBox {
  income_source: string;
  amount: string;
  date: string;
  createdBy: string;
  updatedBy: string;
}

export interface ISupplyBoxModel extends ISupplyBox,Document {}


export const SupplyBoxSchema: Schema = new Schema<ISupplyBox>({
  income_source: { type: String, required: true },
  amount: { type: String },
  date: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
});
  

  export default mongoose.model<ISupplyBoxModel>('SupplyBox',SupplyBoxSchema)

