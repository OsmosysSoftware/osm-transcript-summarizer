import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { JobStatus, Status } from 'src/common/constants/summary';
import { Stream } from 'stream';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
@Entity({ name: 'jobs' })
@ObjectType()
export class Summary {
  @PrimaryGeneratedColumn()
  @Field()
  id?: number;

  @Column({ name: 'job_status', type: 'tinyint', default: 1, width: 1 })
  @IsEnum(JobStatus)
  @Field()
  jobStatus?: number;

  // @Column({ name: 'input_file', type: 'longblob', nullable: true })
  // // @Field(() => GraphQLUpload)
  // inputFile: Buffer;

  @Column({ name: 'input_file', nullable: true })
  @Field(() => String)
  @IsOptional()
  inputFile?: string;

  @Column({ name: 'output_text' })
  @Field()
  @IsOptional()
  outputFile?: string;

  @CreateDateColumn({ name: 'created_on' })
  @Field()
  createdOn?: Date;

  @UpdateDateColumn({ name: 'modified_on' })
  @Field()
  modifiedOn?: Date;

  @Column({ name: 'created_by', default: 'admin' })
  @Field()
  createdBy?: string;

  @Column({ name: 'modified_by', default: 'admin' })
  @Field()
  modifiedBy?: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: Status.ACTIVE,
  })
  @IsEnum(Status)
  @Field()
  status?: number;
}
