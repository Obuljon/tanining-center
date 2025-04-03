import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../model';
import { hash } from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import * as zlib from 'zlib';

@Injectable()
export class MainCrudServiceService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) { }

  async add(data: any): Promise<Teacher | null> {
    const { lname, fname, phone, email, profession } = data;

    let { password } = data;
    password = await hash(password, 10);

    const teacher = new this.teacherModel({
      lname,
      fname,
      phone,
      email,
      profession,
      resume: '_',
      photo: '_',
      password,
      coursesnow: [], // hozirgi kurslar
      coursesdone: [], // tugagan kurslar
      coursesnext: [], // keyingi kurslar
    });
    return teacher.save().catch((err) => {
      console.log(err);
      return null;
    });
  }

  async editbyID(_id: string, data: any): Promise<any | null> {
    const { lname, fname, phone, email, profession, resume, photo } = data;
    return this.teacherModel.updateOne(
      { _id },
      { lname, fname, phone, email, profession, resume, photo },
    );
  }
  async editphoto(_id: string, fileData) {
    const photo = fileData.originalname;
    await this.editbyID(_id, { photo });
    return this.natsClient.send('upload-file', { ...fileData });
  }

  async editresume(_id: string, data) {
    const { originalname, buffer, oldfilename, mimetype, size } = data;
    await this.editbyID(_id, { resume: originalname });
    return this.natsClient.send('upload-file', {
      originalname,
      buffer,
      mimetype,
      oldfilename,
      size,
    });
  }

  async findAll(_page: number = 0, _much: number = 0): Promise<Teacher[]> {
    const page = Math.max(0, _page - 1);
    const limit = Math.max(1, _much);

    return this.teacherModel
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec()
      .catch((err) => []);
  }

  async findbyId(_id: string): Promise<Teacher | null> {
    return this.teacherModel.findById(_id).catch((err) => null);
  }

  async findOneEmail(email: string): Promise<Teacher | null> {
    return this.teacherModel.findOne({ email }).catch((err) => null);
  }

  async deletabyID(_id: any): Promise<true | null> {
    return await this.teacherModel.findByIdAndDelete(_id);
  }
}
