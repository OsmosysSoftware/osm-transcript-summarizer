import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Stream } from 'stream';
import GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class CreateSummaryDTO {
  @Field(() => GraphQLUpload)
  @IsOptional()
  inputFile?: Promise<FileUpload>;
}
