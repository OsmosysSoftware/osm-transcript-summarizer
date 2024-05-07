import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';

const modules = [
  InputTextModule,
  ButtonModule,
  MessagesModule,
  ToastModule,
  ProgressSpinnerModule,
  FileUploadModule,
  TagModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class PrimeNgModule {}
