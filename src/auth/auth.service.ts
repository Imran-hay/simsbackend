import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { User,userSchema } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createCatDto: CreateUserDto): Promise<User> {
      const createdUser = new this.userModel(createCatDto);
      return createdUser.save();
    }
  
    async findAll(): Promise<User[]> {
      return this.userModel.find().exec();
    }

    async login(user:CreateAuthDto) {
        const USER =  this.userModel.findOne({email: user.email});
        if(!USER)
            {
                throw new NotFoundException('user not found')
            }
        return USER
      }



}
