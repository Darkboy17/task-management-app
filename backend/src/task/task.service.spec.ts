import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema/task.schema';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

// Mock Task Data
const mockTask = {
  _id: '60d21b4667d0d8992e610c85',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
};

// Mock Task Model
const mockTaskModel = {
  create: jest.fn().mockResolvedValue(mockTask),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null), // Default: No duplicate found
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockTask), // Simulate finding a task by ID
  }),
  findByIdAndUpdate: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated Task' }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockTask), // Simulate deleting a task
  }),
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockTask]), // Simulate finding all tasks
  }),
  countDocuments: jest.fn().mockResolvedValue(1), // Simulate counting documents
};

describe('TaskService', () => {
  let service: TaskService;
  let model: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    model = module.get<Model<Task>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
      };

      const task = await service.create(createTaskDto);
      expect(task).toEqual(mockTask);
      expect(model.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should throw ConflictException if task title already exists', async () => {
      mockTaskModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTask), // Simulate duplicate title
      });

      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
      };

      await expect(service.create(createTaskDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should find a task by ID', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTask),
      });

      const task = await service.findOne(mockTask._id);
      expect(task).toEqual(mockTask);
      expect(model.findById).toHaveBeenCalledWith(mockTask._id);
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // Simulate task not found
      });

      await expect(service.findOne('60d21b4667d0d8992e610c99')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      await expect(service.findOne('invalid_id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockTaskModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTask),
      });

      const result = await service.remove(mockTask._id);
      expect(result).toEqual({ message: 'Task deleted successfully' });
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockTask._id);
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTaskModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // Simulate task not found
      });

      await expect(service.remove('60d21b4667d0d8992e610c99')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      await expect(service.remove('invalid_id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      mockTaskModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockTask]),
      });
      mockTaskModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({ tasks: [mockTask], total: 1 });
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      // Mock the findByIdAndUpdate method to return the updated task
      mockTaskModel.findByIdAndUpdate.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
      });

      const updatedTask = await service.update(mockTask._id, updateTaskDto);

      // Assertions
      expect(updatedTask.title).toBe('Updated Task');
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTask._id,
        { $set: updateTaskDto }, // Ensure this matches the actual method call
        { new: true, runValidators: true }, // Ensure this matches the actual method call
      );
    });

    it('should throw NotFoundException if task does not exist', async () => {
      // Mock the findByIdAndUpdate method to return null (task not found)
      mockTaskModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('60d21b4667d0d8992e610c99', { title: 'Updated Task' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      await expect(
        service.update('invalid_id', { title: 'Updated Task' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});