import { FilterQuery } from "mongoose";
import fundExpenseModel from "../model/fundExpense.model"
import { log } from "console";

interface PurchaseQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}

export function createFundExpense(input: Partial<any>) {
  return fundExpenseModel.create(input);
}

export async function getUserStatistic() {
  const currentMonth = new Date().getMonth() + 1; // 1-based month
  const currentYear = new Date().getFullYear();

  const data = await fundExpenseModel.find({
    date: { $exists: true }, // Ensure createdAt exists
  });

  const filteredData = data.filter((doc) => {
    const date = new Date(doc.date); // Convert string to Date in JS
    return (
      date.getMonth() + 1 === currentMonth && // Compare month
      date.getFullYear() === currentYear // Compare year
    );
  });

  const bank = filteredData
    .filter((item) => item.modif === "versement en banque")
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
  const fuel = filteredData
    .filter((item) => item.modif === "carburant")
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
  const current = filteredData
    .filter((item) => item.modif === "depense courante")
    .reduce((acc, cur) => acc + Number(cur.amount), 0);
  return { bank, fuel, current };
}


type QueryFilter<T> = FilterQuery<T>;

export async function getFundExpenseByRange(startDate: string, endDate: string) {
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
  const data = await fundExpenseModel.find(filter);
  return data;
}


export async function allFundExpensesPaginated({
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
    filter.team = { $regex: query, $options: "i" }; // Search by name, case-insensitive
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
    fundExpenseModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    fundExpenseModel.countDocuments(filter),
  ]);

  return {
    data: products,
    pageIndex,
    pageSize,
    totalItems: total,
    totalPages: Math.ceil(total / pageSize),
  };
}

//get all fund Expense
export function getAllFundExpense(){
  return fundExpenseModel.find()
}

//get fund Expense by id
export function getFundExpenseById(id: string){
  return fundExpenseModel.findById(id)
}

//update fund Expense by id
export function updateFundExpenseById(id: string,updateData:Partial<any>){
  return fundExpenseModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete fund Expense by id
export function deleteFundExpenseById(id:string){
  return fundExpenseModel.findByIdAndDelete(id)
}
