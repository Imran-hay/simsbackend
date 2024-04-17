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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createCatDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createCatDto);
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
    return tokens;
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

  async refreshToken(user) {
    //check data base for the existance of the hashed token

    const userdb = await this.userModel.findOne({ email: user.email });

    if (!userdb || userdb?.token !== user.refresh_token) {
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
    if (user && user?.password === password) {
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
    await this.userModel.findOneAndUpdate(
      { email },
      { $set: { token: refToken } },
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
