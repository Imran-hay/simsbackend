import { IsEmail, IsNotEmpty, IsString } from 'class-validator'; //npm i class-validator class-transformer --save

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

//export class UpdateUserDto extends PartialType(CreateUserDto){}
