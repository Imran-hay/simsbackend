import { IsEmail ,IsEnum,IsNotEmpty,IsString} from "class-validator"; //npm i class-validator class-transformer --save

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;
    
    @IsNotEmpty()
    salt:string;

    @IsNotEmpty()
    token:string;
    
    created_at:Date;

    @IsEnum(["ADMIN", "TEACHER","STUDENT"],{
        message: "Invalid role"
    })
    role:"ADMIN" | "TEACHER" | "STUDENT"


}


//export class UpdateUserDto extends PartialType(CreateUserDto){}