import { FilterQuery } from "mongoose";
import achatModel from "../model/achat.model"
import StockModel, { IStock } from "../model/stock.model"
import productModel from "../model/product.model";

interface PurchaseQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}

export async function createAchat(input: Partial<any>) {
  const newAchat = await achatModel.create(input);
  console.log("====================================");
  console.log(input);
  console.log("====================================");
  // Search for the corresponding Stock entry
  const existingStock = await StockModel.findOne({
    name: input.name,
  });
  // console.log(existingStock)
  if (existingStock) {
    // If the Stock entry exists, update the quantity and price
    // const currentQuantity = Number(existingStock.quantity)
    var incrementedQuantity =
      Number(existingStock.quantity) + Number(input.quantity);
    console.log("incremented", incrementedQuantity);
    existingStock.quantity = incrementedQuantity.toString(); // Assuming quantity is a number
    existingStock.date = input.date;
    await existingStock.save();
  } else {
    const getProductDetails = await productModel.findOne({ name: input.name });
    // If the Stock entry doesn't exist, create a new entry
    const newStockEntry: Partial<IStock> = {
      name: getProductDetails?.name,
      quantity: input.quantity.toString(),
      unitPrice: getProductDetails?.unitPrice,
      format: getProductDetails?.format,
      status: "",
      date: input.date,
      category: getProductDetails?.category,
      // Set the price based on the Achat price or any other logic
      // price: ... ;
    };
    await StockModel.create(newStockEntry);
  }

  return newAchat;
}

//get all user
export function getAllAchats(){
  return achatModel.find()
}

export async function getUserStatistic() {
  const currentMonth = new Date().getMonth() + 1; // 1-based month
  const currentYear = new Date().getFullYear();

  const data = await achatModel.find({
    date: { $exists: true }, // Ensure createdAt exists
  });

  const filteredData = data.filter((doc) => {
    const date = new Date(doc.date); // Convert string to Date in JS
    return (
      date.getMonth() + 1 === currentMonth && // Compare month
      date.getFullYear() === currentYear // Compare year
    );
  });

  const achat = filteredData
    .filter((item) => item.purchase_type === "achat")
    .reduce((acc, cur) => acc + Number(cur.quantity), 0);
  const commission = filteredData
    .filter((item) => item.purchase_type === "commission")
    .reduce((acc, cur) => acc + Number(cur.quantity), 0);
  const promotion = filteredData
    .filter((item) => item.purchase_type === "promotion")
    .reduce((acc, cur) => acc + Number(cur.quantity), 0);
  return { achat, commission, promotion };
}


type QueryFilter<T> = FilterQuery<T>;

export async function getAchatByRange(startDate: string, endDate: string) {
  const filter: QueryFilter<any> = { $expr: { $and: [] } };

  if (startDate) {
    filter.$expr.$and.push({
      $gte: [{ $dateFromString: { dateString: "$date" } }, new Date(startDate)],
    });
  }

  if (endDate) {
    filter.$expr.$and.push({
      $lte: [{ $dateFromString: { dateString: "$date" } }, new Date(endDate)],
    });
  }

  // Remove $expr if no filters were added
  if (filter.$expr.$and.length === 0) {
    delete filter.$expr;
  }

  // Execute the query (Mongoose example)
  const data = await achatModel.find(filter);
  return data;
}

export async function allAchatPaginated({
  pageIndex,
  pageSize,
  sort,
  query,
  filterData,
  startDate,
  endDate,
}: PurchaseQueryParams & { startDate?: string; endDate?: string }) {
  const skip = (pageIndex - 1) * pageSize; // Calculate documents to skip based on pageIndex and pageSize
  const limit = pageSize;

  // Base filter with search query if provided
  const filter: Record<string, any> = {};

  if (query) {
    filter.invoice_number = { $regex: query, $options: "i" }; // Search by name, case-insensitive
  }

  // console.log(startDate, endDate);

  if (startDate || endDate) {
    filter.$expr = {
      $and: [],
    };

    if (startDate) {
      filter.$expr.$and.push({
        $gte: [
          { $dateFromString: { dateString: "$date" } },
          new Date(startDate),
        ],
      });
    }

    if (endDate) {
      filter.$expr.$and.push({
        $lte: [{ $dateFromString: { dateString: "$date" } }, new Date(endDate)],
      });
    }

    // If no conditions, remove $expr
    if (filter.$expr.$and.length === 0) {
      delete filter.$expr;
    }
  }

  // Add additional filters from filterData if provided
  if (filterData) {
    Object.assign(filter, filterData);
  }

  // Sort handling: Default to sorting by 'createdAt' descending if no other sort is provided
  const sortOptions: Record<string, any> =
    sort && sort.key
      ? { [sort.key]: sort.order === "desc" ? -1 : 1 }
      : { date: -1 }; // Default to 'createdAt' descending

  // Query the database
  const [products, total] = await Promise.all([
    achatModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    achatModel.countDocuments(filter),
  ]);

  return {
    data: products,
    pageIndex,
    pageSize,
    totalItems: total,
    totalPages: Math.ceil(total / pageSize),
  };
}


//get user by id
export function getAchatById(id: string){
  return achatModel.findById(id)
}

//update user by id
export function updateAchatById(id: string,updateData:Partial<any>){
  return achatModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteAchatById(id:string){
  return achatModel.findByIdAndDelete(id)
}
