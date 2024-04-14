import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User,userSchema } from './schemas/user.schema';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }])],
})
export class AuthModule {}
