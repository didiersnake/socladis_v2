import { FilterQuery } from "mongoose";
import emptyStoreModel from "../model/emptyStore.model"

interface PurchaseQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}

export function createEmptyStore(input:Partial<any>) {
  return emptyStoreModel.create(input);
}

//get all user
export function getAllEmptyStores(){
  return emptyStoreModel.find()
}

type QueryFilter<T> = FilterQuery<T>;

export async function getEmptyStoreByRange(startDate: string, endDate: string) {
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
  const data = await emptyStoreModel.find(filter);
  return data;
}

export async function getUserStatistic() {
  const currentMonth = new Date().getMonth() + 1; // 1-based month
  const currentYear = new Date().getFullYear();

  const data = await emptyStoreModel.find({
    date: { $exists: true }, // Ensure createdAt exists
  });

  const filteredData = data.filter((doc) => {
    const date = new Date(doc.date); // Convert string to Date in JS
    return (
      date.getMonth() + 1 === currentMonth && // Compare month
      date.getFullYear() === currentYear // Compare year
    );
  });

  const casiers = filteredData.reduce(
    (acc, cur) => acc + Number(cur.cashier),
    0
  );
  const bottles = filteredData.reduce(
    (acc, cur) => acc + Number(cur.bottle),
    0
  );
  const plastic = filteredData.reduce(
    (acc, cur) => acc + Number(cur.plastic),
    0
  );
  return { casiers, bottles, plastic };
}


export async function allEmptyStorePaginated({
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
    emptyStoreModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    emptyStoreModel.countDocuments(filter),
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
export function getEmptyStoreById(id: string){
  return emptyStoreModel.findById(id)
}

//update user by id
export function updateEmptyStoreById(id: string,updateData:Partial<any>){
  return emptyStoreModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteEmptyStoreById(id:string){
  return emptyStoreModel.findByIdAndDelete(id)
}
