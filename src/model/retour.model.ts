import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct {
  name: string;
  quantity: string;
  format:string;
}

export interface IRetour {
  products: IProduct[];
  date: string;
  team: string
}

export interface IRetourModel extends IRetour, Document {}

const RetourSchema: Schema = new Schema<IRetour>({
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



export default mongoose.model<IRetourModel>('Retour',RetourSchema)

