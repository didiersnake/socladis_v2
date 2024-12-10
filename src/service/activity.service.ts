import activityModel from "../model/activity.model"


export function createActivity(input:Partial<any>) {
  return activityModel.create(input);
}

//get all user
export function getAllActivity(){
  return activityModel.find()
}

//get user by id
export function getActivityById(id: string){
  return activityModel.findById(id)
}

// //update user by id
// export function updateAvariById(id: string,updateData:Partial<any>){
//   return activityModel.findByIdAndUpdate(id, updateData, { new: true })
// }

// //delete user by id
// export function deleteActivityById(id:string){
//   return activityModel.findByIdAndDelete(id)
// }
