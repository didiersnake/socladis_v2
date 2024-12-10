import mongoose,{Document,Schema,model,connect} from 'mongoose'

const date = new Date()

export interface IUser {
    userId: string;
    userName: string;
}


export interface IGroup {
    name: string;
    members: IUser[];
    date:string;
    createdBy: string;
    updatedBy: string;
}

export interface IGroupModel extends IGroup,Document {}


export const GroupSchema: Schema = new Schema<IGroup>({
  name: { type: String },
  members: [
    {
      userId: { type: String },
      userName: { type: String },
    },
  ],
  date: { type: String, default: () => date.toJSON().toString() },
  createdBy: { type: String },
  updatedBy: { type: String },
});
  

  export default mongoose.model<IGroupModel>('Group',GroupSchema)

