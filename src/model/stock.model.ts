import mongoose,{Document,Schema,model,connect} from 'mongoose'
import {customAlphabet }from 'nanoid'



const date = new Date()


export interface IStock {
    name: string;
    category: string;
    format: string;
    quantity: string;
    unitPrice: string;
    status:string;
    date:string;
    productId:string;

}

export interface IStockModel extends IStock,Document {}


export const StockSchema: Schema = new Schema<IStock>({
    name: { type: String, required: true},
    category: { type: String},
    format: { type: String},
    quantity: { type: String, required: true },
    unitPrice: { type: String},
    status: { type: String },
    date: { type: String,default:()=>(date.toJSON()).toString() },
    productId: { type: String},

  });
  

  export default mongoose.model<IStockModel>('Stock',StockSchema)

