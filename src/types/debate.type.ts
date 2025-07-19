import { Types } from "mongoose";

export interface IDebate {
  _id?: string | Types.ObjectId;
  title: string;
  description: string;
  tags: string[];
  category: string;
  image?: string; 
  createdBy: Types.ObjectId; 
  duration: number; 
  endsAt: Date;
  supportSide: Types.ObjectId[]; 
  opposeSide: Types.ObjectId[]; 
  createdAt?: Date;
  updatedAt?: Date;
}
