import RetourModel from "../model/retour.model"
import StockModel, { IStock } from "../model/stock.model"


export async function createRetour(input:Partial<any>) {
  const newAchat = await RetourModel.create(input)
console.log('====================================');
console.log(input);
console.log('====================================');
  // Search for the corresponding Stock entry
  const existingStock = await StockModel.findOne({ name: input.products[0].name, format: input.products[0].format });
  // console.log(existingStock)
  if (existingStock) {
    // If the Stock entry exists, update the quantity and price
    // const currentQuantity = Number(existingStock.quantity)
    var incrementedQuantity = Number(existingStock.quantity) + Number(input.products[0].quantity)
    console.log("incremented",incrementedQuantity)
    existingStock.quantity = ""; // Assuming quantity is a number
    existingStock.quantity = (incrementedQuantity).toString(); // Assuming quantity is a number

    // var incrementedPrice = Number(existingStock.unitPrice) + Number(input.products[0].unitPrice)
    // console.log("incremented",incrementedPrice)
    // existingStock.unitPrice = ""; // Assuming quantity is a number
    // existingStock.unitPrice = (incrementedPrice).toString(); // Assuming quantity is a number
    existingStock.date = input.products[0].date
    // Update the price according to your logic
    // existingStock.price = ... ; // Update the price based on the Achat price
    await existingStock.save();
    
  }
   else {
    // If the Stock entry doesn't exist, create a new entry
    const newStockEntry: Partial<IStock> = {
      name: input.name,
      quantity: input.quantity.toString(),
      unitPrice: input.unitPrice,
      format: input.format,
      status: "",
      date: input.date,
      category:input.category
      // Set the price based on the Achat price or any other logic
      // price: ... ;
    };
    await StockModel.create(newStockEntry);
  }

  return newAchat;
}

//get all user
export function getAllRetours(){
  return RetourModel.find()
}

//get user by id
export function getRetourById(id: string){
  return RetourModel.findById(id)
}

//update user by id
export function updateRetourById(id: string,updateData:Partial<any>){
  return RetourModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteRetourById(id:string){
  return RetourModel.findByIdAndDelete(id)
}
