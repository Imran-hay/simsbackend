import { IsEmail ,IsEnum,IsNotEmpty,IsString} from "class-validator"; //npm i class-validator class-transformer --save

export class CreateAuthDto{
    

   
    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    password:string;
 


}


//export class UpdateUserDto extends PartialType(CreateUserDto){}