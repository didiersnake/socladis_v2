import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct {
  name: string;
  quantity: string;
  format:string;
}

export interface IChargement {
  products: IProduct[];
  date: string;
  team: string
}

export interface IChargementModel extends IChargement, Document {}

const ChargementSchema: Schema = new Schema<IChargement>({
  products: [
    {
      name: { type: String },
      quantity: { type: String },
      format: { type: String },

    },
  ],
  date: { type: String, default: () => new Date().toJSON() },
  team: { type: String },
});



export default mongoose.model<IChargementModel>('Chargement',ChargementSchema)

