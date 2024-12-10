import mongoose,{Document,Schema,model,connect} from 'mongoose'

const date = new Date()


export interface IemptyStore {
  team: string;
  plastic: string;
  bottle: string;
  cashier: string;
  date: string;
  format: string;
  createdBy: string;
  updatedBy: string;
}

export interface IemptyStoreModel extends IemptyStore,Document {}


export const emptyStoreSchema: Schema = new Schema<IemptyStore>({
  team: { type: String },
  plastic: { type: String },
  bottle: { type: String },
  cashier: { type: String },
  date: { type: String },
  format: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
});
  

  export default mongoose.model<IemptyStoreModel>('emptyStore',emptyStoreSchema)

