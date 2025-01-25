import UserModel from "../model/user.model"

interface UserQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}

export function createUser(input:Partial<any>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByName(name: string) {
  return UserModel.findOne({ name });
}

//get all user
export function getAllEmployeeUsers(){
  return UserModel.find({ roles: "EMPLOYEE" });
}

export function getAllClientUsers() {
  return UserModel.find({ roles: "CLIENT" });
}

export async function getUserStatistic() {
  let result;
  const allUsers = await UserModel.countDocuments({});
  const employees = await UserModel.countDocuments({ roles: "EMPLOYEE" });
  const customers = await UserModel.countDocuments({ roles: "CLIENT" });
  result = { users: allUsers, employees: employees, customers: customers };
  return result;
}


export async function allUsersPaginated({
  pageIndex,
  pageSize,
  sort,
  query,
  filterData,
}: UserQueryParams) {
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
    UserModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
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
export function getUserById(id: string){
  return UserModel.findById(id)
}

//update user by id
export function updateUserById(id: string,updateData:Partial<any>){
  return UserModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteUserById(id:string){
  return UserModel.findByIdAndDelete(id)
}
