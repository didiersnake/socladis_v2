import ChargementModel from "../model/chargement.model"


export async function createCharge(input:Partial<any>) {
  const newCharge = ChargementModel.create(input)
  return newCharge;
}

//get all user
export function getAllCharges(){
  return ChargementModel.find()
}

//get user by id
export function getChargeById(id: string){
  return ChargementModel.findById(id)
}

//update user by id
export function updateChargeById(id: string,updateData:Partial<any>){
  return ChargementModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteChargeById(id:string){
  return ChargementModel.findByIdAndDelete(id)
}
