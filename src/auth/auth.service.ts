import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { tokens } from './types';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async handleUserRegistration(createUserDto:CreateUserDto): Promise<User>
  {
    console.log(createUserDto.email)
    const salt = await bcrypt.genSalt()
    const password = createUserDto.password
    const hash = await bcrypt.hash(password, salt);

    const updatedUser = {
      ...createUserDto,
      salt:salt,
      password:hash
    };

    const createdUser = new this.userModel(updatedUser);
    return createdUser.save();

  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt()
    const password = createUserDto.password
    const hash = await bcrypt.hash(password, salt);

    const updatedUser = {
      ...createUserDto,
      salt:salt,
      password:hash
    };

    const createdUser = new this.userModel(updatedUser);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  // auth implementation

  async signinLocal(dto: any) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    const tokens = await this.getToken(user.name, user.email, user.role);
    await this.saveHashedToken(user.email, tokens.refresh_token);
    return {
      ...tokens,
      name:user.name,
      email:user.email,
      role:user.role

    };
  }
  // remove the hashed token from the database
  async logout(email) {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $set: { token: '' } },
    );
    if (!user) throw new HttpException('Invalid credentials', 401);
    return 'Logged out successfully!';
  }

  async getProfile(email) {
    const user = await this.userModel.findOne({email:email})
     
    if (!user) throw new HttpException('Invalid credentials', 401);
    return {
    email:user.email,
    role:user.role,
    name:user.name
    };
  }

  async refreshToken(user) {
    //check data base for the existance of the hashed token

    const userdb = await this.userModel.findOne({ email: user.email });

    const isMatch = await bcrypt.compare(user.refresh_token, userdb?.token);

    if (!userdb || !isMatch) {   //compare using the bcrypt algorithm
      throw new HttpException('Invalid credentials', 401);
    }
    const tokens = await this.getToken(user.sub, user.email, user.role);
    await this.saveHashedToken(user.email, tokens.refresh_token);
    return tokens;
  }
  // validate the users existance and password
  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    // for hash password use bcrypt compare method bcrpt.compare(password, user.password)
    const isMatch = await bcrypt.compare(password, user?.password);
    console.log("isMatch: " + isMatch)

    if (user && isMatch) {
      const result = { name: user?.name, email: user?.email, role: user?.role };
      return result;
    } else {
      return null;
    }
  }
  async getToken(name, email, role): Promise<tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: name, email, role },
        { secret: 'secretKey', expiresIn: '1h' },
      ),
      this.jwtService.signAsync(
        { sub: name, email, role },
        { secret: 'secretKeyRefresh', expiresIn: '7d' },
      ),
    ]);
    return { access_token, refresh_token };
  }
  async saveHashedToken(email, refToken) {
    // save hashed token in database
    const salt = 10;
const hash = await bcrypt.hash(refToken, salt);


    await this.userModel.findOneAndUpdate(
      { email },
      { $set: { token: hash } },  ///here save the hased token
    );
  }

  // end
  // async login(user: CreateAuthDto) {
  //   const USER = await this.userModel.findOne({ email: user.email });

  //   if (USER) {
  //     if (user.password !== USER.password) {
  //       throw new UnauthorizedException('wrong credentials');
  //     } else {
  //       return 'Hello';
  //     }
  //   } else {
  //     throw new NotFoundException('user not found');
  //   }
  // }
}
