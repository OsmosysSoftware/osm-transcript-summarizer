import { Injectable } from '@angular/core';
import { uploadFileMutation } from '../../graphql/graphql.queries';
import { GraphqlService } from '../../graphql/graphql.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private graphqlService: GraphqlService) { }

  uploadFile(file: File): Observable<any> {
    console.log("file service",file);

    const variables = { file: file };
    return this.graphqlService.mutate(uploadFileMutation, variables);
  }
}
