import { InputType, Field } from '@nestjs/graphql';
import { registerDecorator, ValidationOptions, ValidationArguments, IsOptional } from 'class-validator';
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

  // @Field(() => GraphQLUpload)
  // @IsNotEmpty({ message: 'Content or path must be provided' })
  // // @ValidateIf((obj) => !obj.content, { message: 'Content or path must be provided' })
  // inputFile: any;

  @Field(() => GraphQLUpload)
  @IsOptional()
  inputFile?: Promise<FileUpload>;

}

// TODO: Custom Validator added for the bug
export function AttachmentValidation(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'attachmentValidation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown[]) {
          if (!value || value.length === 0) {
            return false;
          }

          for (const attachment of value) {
            const path = attachment['path'];
            const content = attachment['content'];
            const filename = attachment['filename'];

            if ((!path && !content) || !filename?.length) {
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          if (!args.value || args.value.length === 0) {
            return 'Attachments must be provided';
          }

          for (const attachment of args.value) {
            if (!attachment['filename']?.length) {
              return 'Filename cannot be empty';
            }

            if (!attachment['content'] && !attachment['path']) {
              return 'Content or path must be provided for each attachment';
            }
          }

          return 'Invalid attachments';
        },
      },
    });
  };
}

