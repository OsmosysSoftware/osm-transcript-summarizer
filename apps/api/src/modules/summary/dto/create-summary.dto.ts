import { InputType, Field } from '@nestjs/graphql';
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
  inputFile: Promise<FileUpload>;
}
