import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'users' })
export class Users {
  @Prop({ type: String, required: false })
  firstName: string;

  @Prop({ type: String, required: false })
  lastName: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true})
  role: string;

  @Prop({ type: String, required: false })
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);

export type UserLeanDoc = Users & { _id: Types.ObjectId };
export type UserDoc = Users & Document;
