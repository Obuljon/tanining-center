import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

@Schema()
export class Teacher{
    @Prop({ required: true })
    lname: string;

    @Prop({ required: true })
    fname: string;

    @Prop({ required: true })
    password:string;

    @Prop({ required: true })
    photo: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    profession: string;

    @Prop({ required: true })
    resume: string 

    @Prop([String])
    coursesnow: ObjectId[];

    @Prop([String])
    coursesdone: ObjectId[];

    @Prop([String])
    coursesnext: ObjectId[];
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher)