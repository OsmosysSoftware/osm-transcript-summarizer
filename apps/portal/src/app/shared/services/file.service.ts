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

    return this.graphqlService.mutate(uploadFileMutation, file);
  }

  // uploadFile(file: File): Observable<any> {
  //   const operations = {
  //     query: `
  //       mutation ($file: Upload!) {
  //         createSummary(createSummaryInput: { inputFile: $file }) {
  //           jobId
  //         }
  //       }
  //     `,
  //     variables: {
  //       file: null
  //     }
  //   };

  //   const map = {
  //     file: ["variables.file"]
  //   };

  //   const formData = new FormData();
  //   formData.append('operations', JSON.stringify(operations));
  //   formData.append('map', JSON.stringify(map));
  //   formData.append('file', file, file.name);

  //   return this.http.post('http://localhost:3000/graphql', formData);
  // }


//   uploadFile(file: File) {
//     const formData = new FormData();
//     formData.append('file', file);

//     return fetch('http://localhost:3000', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.json())
//     .catch(error => console.error('Error uploading file:', error));
//   }
}
