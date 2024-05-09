import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Stream } from 'stream';
// @ts-ignore
import Upload = require('graphql-upload/Upload.js');
// @ts-ignore
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

