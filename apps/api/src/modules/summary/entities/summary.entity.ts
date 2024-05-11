import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { JobStatus, Status } from 'src/common/constants/summary';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'jobs' })
@ObjectType()
export class Summary {
  @PrimaryGeneratedColumn({name: 'job_id'})
  @Field()
  jobId: number;

  @Column({ name: 'job_status', type: 'tinyint', width: 1 })
  @IsEnum(JobStatus)
  @Field()
  jobStatus: number;

  @Column({ name: 'input_file', type: 'blob' })
  @Field()
  inputFile: Buffer;

  @Column({ name: 'output_text' })
  @IsEnum(JobStatus)
  @Field()
  outputFile: number;

  @CreateDateColumn({ name: 'created_on' })
  @Field()
  createdOn: Date;

  @UpdateDateColumn({ name: 'modified_on' })
  @Field()
  modifiedOn: Date;

  @Column({ name: 'created_by' })
  @Field()
  createdBy: string;

  @Column({ name: 'modified_by' })
  @Field()
  modifiedBy: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: Status.ACTIVE,
  })
  @IsEnum(Status)
  @Field()
  status: number;

  constructor(summary: Partial<Summary>) {
    Object.assign(this, summary);
  }
}
