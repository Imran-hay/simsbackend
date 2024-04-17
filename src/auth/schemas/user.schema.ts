import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
// eemaul with liikn
//prfile diavtvate
// rest
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';

  @Prop()
  salt: string;

  @Prop()
  token: string;

  @Prop()
  created_at: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
