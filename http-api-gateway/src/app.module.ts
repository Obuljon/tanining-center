import { Module } from '@nestjs/common';
import { TeacherModule } from './controller/teacher/teacher.module';
import { NatsClientModule } from './nats-client/nats-client.module';
import { CourseModule } from './controller/course/course.module';
import { StudentModule } from './controller/student/student.module';
import { UploadModule } from './controller/upload/upload.module';

@Module({
  imports: [NatsClientModule, TeacherModule, CourseModule, StudentModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
