import { IsEmail ,IsEnum,IsNotEmpty,IsString} from "class-validator"; //npm i class-validator class-transformer --save

export class CreateAuthDto{
    

   
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;
 


}


//export class UpdateUserDto extends PartialType(CreateUserDto){}