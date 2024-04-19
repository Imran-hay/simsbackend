import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { AtAuthGuad, RtAuthGuard } from './guard';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('user-registered')
  handleOrderPlaced(@Payload() user:CreateUserDto) {
    return this.authService.handleUserRegistration(user);
  }



  @Get('/findAll') //test route
  findAll() {
    return this.authService.findAll();
  }

  @Post('/create') //test route
  create(@Body(ValidationPipe) user: CreateUserDto) {
    return this.authService.create(user);
  }

  @Post('/signin')
  async signin(
    @Body(ValidationPipe) createAuthDto: CreateAuthDto,
  ): Promise<any> {
    console.log(createAuthDto);
    return this.authService.signinLocal(createAuthDto);
  }
  @UseGuards(AtAuthGuad)
  @Post('logout')
  async logout(@Req() req: any) {
    const user = req.user;
    return await this.authService.logout(user.email);
  }
  @UseGuards(RtAuthGuard)
  @Post('/refresh-token')
  async refreshToken(@Req() req: any) {
    const user = req.user;
    console.log(user);
    return this.authService.refreshToken(user);
    // use the sub to generate a new token
  }
}
