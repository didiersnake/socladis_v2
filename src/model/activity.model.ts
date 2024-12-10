import mongoose,{Document,Schema,model,connect} from 'mongoose'
import {customAlphabet }from 'nanoid'



const date = new Date()


export interface IActivity {
    userId: string;
    userName: string;
    timestamp: Date;
    ipAddress: string;
    activity: string
}

export interface IActivityModel extends IActivity,Document {}


export const ActivitySchema: Schema = new Schema<IActivity>({
    userId: { type: String ,required: true },
    userName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    ipAddress: { type: String, required: true },
    activity: { type: String, required: true },
  });
  

  export default mongoose.model<IActivityModel>('Activity',ActivitySchema)

