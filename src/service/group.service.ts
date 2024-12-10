import GroupModel from "../model/group.model"


export function createGroup(input:Partial<any>) {
  return GroupModel.create(input);
}

//get all group
export function getAllGroups(){
  return GroupModel.find()
}

//get group by id
export function getGroupById(id: string){
  return GroupModel.findById(id)
}

//update group by id
export function updateGroupById(id: string,updateData:Partial<any>){
  return GroupModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete group by id
export function deleteGroupById(id:string){
  return GroupModel.findByIdAndDelete(id)
}
