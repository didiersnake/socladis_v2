
import ProductModel from "../model/product.model"
import log from "../utils/logger";


interface ProductQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}

export function createProduct(input:Partial<any>) {
  return ProductModel.create(input);
}

//get all user
export function getAllProducts(){
  return ProductModel.find()
}

export async function allProductsPaginated({
  pageIndex,
  pageSize,
  sort,
  query,
  filterData,
}: ProductQueryParams) {
  const skip = (pageIndex - 1) * pageSize; // Calculate documents to skip based on pageIndex and pageSize
  const limit = pageSize;  

  // Base filter with search query if provided
  const filter: Record<string, any> = {};

  if (query) {
    filter.name = { $regex: query, $options: "i" }; // Search by name, case-insensitive
  }

  // Add additional filters from filterData if provided
  if (filterData) {
    Object.assign(filter, filterData);
  }

  // Sort handling: Default to sorting by 'createdAt' descending if no other sort is provided
  const sortOptions: Record<string, any> =
    sort && sort.key
      ? { [sort.key]: sort.order === "desc" ? -1 : 1 }
      : { createdAt: -1 }; // Default to 'createdAt' descending

  // Query the database
  const [products, total] = await Promise.all([
    ProductModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    ProductModel.countDocuments(filter),
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
export function getProductById(id: string){
  return ProductModel.findById(id)
}

//update user by id
export function updateProductById(id: string,updateData:Partial<any>){
  return ProductModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteProductById(id:string){
  return ProductModel.findByIdAndDelete(id)
}
