import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';
import { JobStatus, Status } from 'src/common/constants/summary';
@Entity({ name: 'summary' })
@ObjectType()
export class Summary {
  @PrimaryGeneratedColumn({ name: 'job_id' })
  @Field()
  jobId: number;

  @Column({ name: 'job_status', type: 'tinyint', default: 1, width: 1 })
  @IsEnum(JobStatus)
  @Field()
  jobStatus: number;

  @Column({ name: 'input_file' })
  @Field(() => String)
  @IsOptional()
  inputFile: string;

  @Column({ name: 'output_text', nullable: true })
  @Field({ nullable: true })
  outputText: string;

  @CreateDateColumn({ name: 'created_on' })
  @Field()
  createdOn: Date;

  @UpdateDateColumn({ name: 'modified_on' })
  @Field()
  modifiedOn: Date;

  @Column({ name: 'created_by', default: 'admin' })
  @Field()
  createdBy: string;

  @Column({ name: 'modified_by', default: 'admin' })
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
}
