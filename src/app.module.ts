import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ensures it loads the file
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config
            .get<string>('MONGO_URI', '')
            .replace('${DB_PASS}', config.get<string>('DB_PASS', '')),
        };
      },
    }),
    StudentModule,
    CourseModule,
  ],
})
export class AppModule {}
