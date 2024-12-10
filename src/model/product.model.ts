import mongoose,{Document,Schema,model,connect} from 'mongoose'
import {customAlphabet }from 'nanoid'



const date = new Date()

export interface ISalePrice {
    grossiste: string, 
    Semi_grossiste: string,
    detaillant: string, 
    random:string
  }

  
export interface IProduct {
    name: string;
    unitPrice: string;
    format:string;
    category:string;
    sale_price:ISalePrice[]
}

export interface IProductModel extends IProduct,Document {}


export const ProductSchema: Schema = new Schema<IProduct>({
    name: { type: String, required: true},
    category: { type: String},
    format: { type: String},
    unitPrice: { type: String},
    sale_price: [
        {
            grossiste: { type: String },
            Semi_grossiste: { type: String },
            detaillant: { type: String },
            random: { type: String },
        },
      ],
  });
  

  export default mongoose.model<IProductModel>('Product',ProductSchema)

