import { Component } from '@angular/core';
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'insights';

  analyse_pre: boolean;
  analyse_post: boolean;
  data_info:string;

  pre_marker_no: number = 5;
  post_marker_no: number = 5;
  similarity_n: number = 10;
  pre_expr_no: number = 1;
  post_expr_no:number = 1;

  label_set1: string = "S1";
  label_set2: string = "S2";

  show_for_genes = ["TP53"];

  constructor(@Inject(DOCUMENT) document) {
      //document.getElementById('el');
   }

  ngOnInit(){
    this.analyse_pre = false;
    this.analyse_post = false;
    this.data_info = " ";
  }

  change_pre(){
    //console.log("in parent");
    this.analyse_pre = ! this.analyse_pre;
    //console.log(this.analyse_pre);
  }

  change_label_set1(event){
    this.label_set1 = event;
  }
  change_label_set2(event){
    this.label_set2 = event;
  }

  change_post(){
    this.analyse_post = ! this.analyse_post;
  }

  add_data_info(text){
    console.log(text);
    this.data_info = text;
    console.log(this.data_info);
  }

  pre_marker_no_change(event){
    this.pre_marker_no = event;

  }
  post_marker_no_change(event){
    this.post_marker_no = event;
  }

  pre_expr_no_change(event){
    this.pre_expr_no = event;

  }
  post_expr_no_change(event){
    this.post_expr_no = event;
  }

  similarity_n_change(event){
    this.similarity_n = event;
  }

  show_for_genes_push(gene){
    console.log("in parent added "+ gene);
    this.show_for_genes.push(gene);
  }

  show_for_genes_pop(){
    this.show_for_genes.pop();
  }


  download(){
    const div = document.querySelector( '.report' );

    const options = {background: "white", height: "3000px", width: div.clientWidth};

    html2canvas(div, options).then((canvas) => {
    //Initialize JSPDF
    let doc = new jsPDF("p", "mm", "a3");
    //Converting canvas to Image
    let imgData = canvas.toDataURL("image/PNG");
    //Add image Canvas to PDF
    doc.addImage(imgData, 'PNG', 20, 20);

    let pdfOutput = doc.output();
    // using ArrayBuffer will allow you to put image inside PDF
    let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);
    for (let i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
    }

    //Name of pdf
    const fileName = "report.pdf";

    // Make file
    doc.save(fileName);

    });
  }

}
