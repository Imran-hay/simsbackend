import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { User,userSchema } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private catModel: Model<User>) {}

    async create(createCatDto: CreateUserDto): Promise<User> {
      const createdCat = new this.catModel(createCatDto);
      return createdCat.save();
    }
  
    async findAll(): Promise<User[]> {
      return this.catModel.find().exec();
    }



}
