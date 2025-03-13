import { Schema } from 'mongoose';
import { TaskSchema } from './task.schema';

describe('TaskSchema', () => {
  it('should be defined', () => {
    expect(TaskSchema).toBeDefined();
    expect(TaskSchema instanceof Schema).toBe(true);
  });
});