import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct {
  name: string;
  price: string;
  quantity: string;
  total: string;
  // format:string;
}

export interface IPayment {
  cash: string;
  credit: string;
  ristourn: string;
  emballages: string;
}

export interface ISales {
  clientName: string;
  products: IProduct[];
  total_without_tax: string;
  VAT_amount: string;
  withdrawal_amount: string;
  total_with_tax: string;
  ristourne: string;
  status: string;
  date: string;
  payment_method: IPayment[];
  invoice_number: string; // New field for invoice number
  createdBy: string;
}

export interface ISalesModel extends ISales, Document {}

const SalesSchema: Schema = new Schema<ISales>({
  clientName: { type: String, required: true },
  products: [
    {
      name: { type: String },
      price: { type: String },
      quantity: { type: String },
      total: { type: String },
      // format: { type: String },

    },
  ],
  total_without_tax: { type: String, required: true },
  VAT_amount: { type: String },
  withdrawal_amount: { type: String },
  total_with_tax: { type: String },
  ristourne: { type: String },
  status: { type: String },
  date: { type: String, default: () => new Date().toJSON() },
  payment_method: [
    {
      cash: { type: String },
      credit: { type: String },
      ristourn: { type: String },
      emballages: { type: String },
    },
  ],
  invoice_number: { type: String }, // Define invoice number field
  createdBy: {type: String}
});

// SalesSchema.pre<ISalesModel>('save', async function (next) {
//   if (this.isNew) {
//     const Sales = this.constructor as Model<ISalesModel>;
//     const latestInvoice: ISalesModel[] = await Sales.find({}).sort({ invoice_number: -1 }).limit(1);

//     let newInvoiceNumber = 'INV0001';

//     if (latestInvoice.length > 0 && latestInvoice[0].invoice_number) {
//       const number = parseInt(latestInvoice[0].invoice_number.replace('INV', ''), 10) + 1;
//       newInvoiceNumber = `INV${number.toString().padStart(4, '0')}`;
//     }

//     this.invoice_number = newInvoiceNumber;
//   }

//   next();
// });

const SalesModel: Model<ISalesModel> = mongoose.model<ISalesModel>('Sales', SalesSchema);

export default SalesModel;
