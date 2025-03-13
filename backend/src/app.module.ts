import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI), // using MongoDB Atlas for quick setup and cloud storage
    TaskModule,
  ],
})
export class AppModule {}
