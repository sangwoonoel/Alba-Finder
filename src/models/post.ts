import { Schema, model, Document } from 'mongoose';


interface IUserEmbedded {
    userId: Schema.Types.ObjectId;
    nickname: string;
    mannerTemperature: number;
    isVerified: boolean;
  }

interface IPost extends Document {
  title: string;
  content: string;
  author: IUserEmbedded;
  createdAt: Date;
}

const userEmbeddedSchema = new Schema<IUserEmbedded>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    nickname: { type: String, required: true },
    mannerTemperature: { type: Number, required: true },
    isVerified: { type: Boolean, required: true },
  });

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: userEmbeddedSchema, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

export const Post = model<IPost>('Post', postSchema);