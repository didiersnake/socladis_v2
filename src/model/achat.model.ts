import mongoose,{Document,Schema,model,Model ,connect} from 'mongoose'
const date = new Date()

export interface IAchat {
    name: string;
    unitPrice: string;
    updatedBy: string;
    createdBy: string;
    quantity: string;
    date:string;
    // status:string;
    // productId:string;
    invoice_number: string
    purchase_type: string

}


export interface IAchatModel extends IAchat,Document {}


export const AchatSchema: Schema = new Schema<IAchat>({
    name: { type: String, required: true},
    unitPrice: { type: String},
    createdBy: { type: String},
    quantity: { type: String, required: true },
    updatedBy: { type: String},
    date: { type: String,default:()=>(date.toJSON()).toString() },
    // status:{ type: String},
    // productId:{ type: String},
    invoice_number: { type: String }, // Define invoice number field
    purchase_type: { type: String }, // Define invoice number field
  });
  
  
  export default mongoose.model<IAchatModel>('Achat',AchatSchema)

