import { FilterQuery } from "mongoose";
import SupplyBoxsModel from "../model/supplyBox.model"


interface PurchaseQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}


export function createSupplyBox(input:Partial<any>) {
  return SupplyBoxsModel.create(input);
}

//get all supply box
export function getAllSupplyBoxs(){
  return SupplyBoxsModel.find()
}
type QueryFilter<T> = FilterQuery<T>;

export async function getSupplyBoxByRange(startDate: string, endDate: string) {
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
  const data = await SupplyBoxsModel.find(filter);
  return data;
}

export async function allSupplyBoxPaginated({
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
    SupplyBoxsModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    SupplyBoxsModel.countDocuments(filter),
  ]);

  return {
    data: products,
    pageIndex,
    pageSize,
    totalItems: total,
    totalPages: Math.ceil(total / pageSize),
  };
}

//get supply box by id
export function getSupplyBoxById(id: string){
  return SupplyBoxsModel.findById(id)
}

//update supply box by id
export function updateSupplyBoxById(id: string,updateData:Partial<any>){
  return SupplyBoxsModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete supply box by id
export function deleteSupplyBoxById(id:string){
  return SupplyBoxsModel.findByIdAndDelete(id)
}
