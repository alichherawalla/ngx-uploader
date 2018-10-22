import { Component, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx2-uploader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;

  constructor() {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  onUploadOutput(output: UploadOutput): void {
    console.log('output', output);
    if (output.type === 'allAddedToQueue') {
      /*const event: UploadInput = {
        type: 'uploadAll',
        url: 'https://ngx-uploader.com/upload',
        method: 'POST',
        data: { foo: 'bar' }
      };

      this.uploadInput.emit(event);*/
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.indexOf(output.file);
      this.files[index] = output.file;
      /*const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);*/
      /*this.files[index] = output.file;*/
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'done') {
      console.log(output);
    } else if (output.type === 'cancelled') {
      console.log(output);
    }
    /*this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);*/
  }
  readonly DEFAULT_PROGRESS = {
    status: 0,
    data: {
      percentage: 0,
      speed: 0,
      speedHuman: '0 Byte/s',
      startTime: null,
      endTime: null,
      eta: null,
      etaHuman: null
    }
  };
  cleanFile(file: UploadFile) {
    file.progress = this.DEFAULT_PROGRESS;
    file.response = null;
    file.responseHeaders = null;
    file.responseStatus = null;
    file.progress.status = UploadStatus.Queue;
  }
  startUpload(file: UploadFile): void {
    console.log('startUpload', file);
    this.cleanFile(file);
    const event: UploadInput = {
      type: 'uploadFile',
      id: file.id,
      file,
      url: 'https://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' }
    };
    this.uploadInput.emit(event);
  }

  startUploadAll(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'https://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}
