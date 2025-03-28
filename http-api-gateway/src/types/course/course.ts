import { DatabaseId, Week } from '../';
////////////////////////////////////////////////////////////////////////////////

export default interface Course {
  id: DatabaseId;
  title: string;
  time: string;
  date: string;
  weektime: Week[];
  description: string;
  photo: string | null;
  teacher: DatabaseId | null;
  students: DatabaseId[];
  lessons: DatabaseId[];
  price: number;
  currency: string;
  level: string; // beginner, intermediate, advanced
}
