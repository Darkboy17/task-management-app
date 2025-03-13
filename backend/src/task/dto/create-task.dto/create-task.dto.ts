import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['pending', 'in-progress', 'completed'])
  status: 'pending' | 'in-progress' | 'completed';
}
