import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Teacher } from '../../types';

export default class AddTeacherDTO implements Teacher {
  @IsString()
  @IsNotEmpty()
  lname: string;

  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  profession: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
