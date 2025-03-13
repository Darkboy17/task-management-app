import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema/task.schema';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {

    // Check for duplicate task
    const existingTask = await this.taskModel.findOne({ title: createTaskDto.title }).exec();
    if (existingTask) {
      throw new ConflictException('Task with this title already exists'); // ✅ NestJS handles this automatically
    }

    // Insert the task only if no duplicate exists
    return await this.taskModel.create({ ...createTaskDto, title: createTaskDto.title });
  }

  async findAll(page: number = 1, limit: number = 5): Promise<{ tasks: Task[]; total: number }> {
    const skip = (page - 1) * limit;

    const tasks = await this.taskModel.find().skip(skip).limit(limit).exec();
    const total = await this.taskModel.countDocuments();

    return { tasks, total };
  }

  async findOne(id: string): Promise<Task> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      { $set: updateTaskDto },
      { new: true, runValidators: true } // Return updated task and validate input
    );

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Task with ID ${id} not found`);

    return { message: 'Task deleted successfully' };
  }
}
