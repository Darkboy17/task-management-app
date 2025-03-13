import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  async getTasks(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.taskService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}