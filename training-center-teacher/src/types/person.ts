import { DatabaseId } from '.';

export default interface Teacher {
  id?: DatabaseId;
  lname: string;
  fname: string;
  password: string;
  photo?: string | null;
  phone: string;
  email: string;
  profession: string;
  resume?: string | null;
  coursesnow?: DatabaseId[];
  coursesdone?: DatabaseId[];
  coursesnext?: DatabaseId[];
}
