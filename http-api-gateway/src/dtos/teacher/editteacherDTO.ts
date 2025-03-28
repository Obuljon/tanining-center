import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Teacher } from "../../types";

export default class EditTeacherDTO implements Teacher {
    @IsOptional()
    @IsString()
    lname: string;

    @IsOptional()
    @IsString()
    fname: string;

    @IsOptional()
    @IsPhoneNumber()
    phone: string;
    
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    profession: string;

    @IsOptional()
    @IsString()
    photo?: string | null | undefined;
    
    @IsOptional()
    @IsString()
    resume?: string | null;

    @IsOptional()
    @IsString()
    password: string;

}