import mongoose,{Document,Schema,model,connect} from 'mongoose'

const date = new Date()

export interface IFundExpense {
    modif: string;
    amount: string;
    bank: string;
    date:string;
    createdBy: string;
    updatedBy: string;
}

export interface IFundExpenseModel extends IFundExpense,Document {}


export const FundExpenseSchema: Schema = new Schema<IFundExpense>({
    modif: { type: String, required: true},
    amount: { type: String},
    bank: { type: String},
    date: { type: String,default:()=>(date.toJSON()).toString() },
    createdBy: { type: String},
    updatedBy: { type: String},
  });
  

  export default mongoose.model<IFundExpenseModel>('FundExpense',FundExpenseSchema)

