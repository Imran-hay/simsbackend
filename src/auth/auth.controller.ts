import { Body, Controller, Delete, Get, Param, Patch, Post, Query,ParseIntPipe,ValidationPipe } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Get('/findAll') //test route
    findAll(){
        
        return this.authService.findAll()
    }

    @Post('/create') //test route
    create(@Body(ValidationPipe) user: CreateUserDto)
    {
        return this.authService.create(user)
    }

    @Post('/login')
    async login(@Body(ValidationPipe) createAuthDto: CreateAuthDto): Promise<any> {

        //////
      
       return this.authService.login(createAuthDto)
    }





}
