import { CreateAuthDto } from "./create-auth.dto"
import {PartialType} from "@nestjs/mapped-types"// npm i @nestjs/mapped-types -D

export class UpdateUserDto extends PartialType(CreateAuthDto){}