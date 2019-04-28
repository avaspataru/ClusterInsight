import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnInit {

  public pre_dge_uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/api/upload/pre_dge', itemAlias: 'pre_dge'});
  public pre_gene_uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/api/upload/pre_gene', itemAlias: 'pre_gene'});
  public pre_cell_uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/api/upload/pre_cell', itemAlias: 'pre_cell'});

  public post_dge_uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/api/upload/post_dge', itemAlias: 'post_dge'});
  public post_gene_uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/api/upload/post_gene', itemAlias: 'post_gene'});
  public post_cell_uploader: FileUploader = new FileUploader({url: 'http://localhost:3000/api/upload/post_cell', itemAlias: 'post_cell'});

  constructor() { }

  ngOnInit() {
    this.pre_dge_uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.pre_dge_uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
     };

     this.pre_gene_uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
     this.pre_gene_uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log('ImageUpload:uploaded:', item, status, response);
          alert('File uploaded successfully');
      };

      this.pre_cell_uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
      this.pre_cell_uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
           console.log('ImageUpload:uploaded:', item, status, response);
           alert('File uploaded successfully');
       };

       this.post_dge_uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
       this.post_dge_uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log('ImageUpload:uploaded:', item, status, response);
            alert('File uploaded successfully');
        };

        this.post_gene_uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        this.post_gene_uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
             console.log('ImageUpload:uploaded:', item, status, response);
             alert('File uploaded successfully');
         };

         this.post_cell_uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
         this.post_cell_uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
              console.log('ImageUpload:uploaded:', item, status, response);
              alert('File uploaded successfully');
          };
  }

}
