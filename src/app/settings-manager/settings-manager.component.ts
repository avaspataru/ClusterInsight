import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-manager',
  templateUrl: './settings-manager.component.html',
  styleUrls: ['./settings-manager.component.css']
})
export class SettingsManagerComponent implements OnInit {

   @Input() analyse_pre: boolean;
   @Input() analyse_post: boolean;
   @Input() data_info: string;

   @Output() change_pre: EventEmitter<void> = new EventEmitter<void>();
   @Output() change_post: EventEmitter<void> = new EventEmitter<void>();
   @Output() add_data_info: EventEmitter<string> = new EventEmitter<string>();



   @Output() pre_marker_no: EventEmitter<number> = new EventEmitter<number>();
   @Output() post_marker_no: EventEmitter<number> = new EventEmitter<number>();
   @Output() similarity_n: EventEmitter<number> = new EventEmitter<number>();

   @Output() pre_expr_no: EventEmitter<number> = new EventEmitter<number>();
   @Output() post_expr_no: EventEmitter<number> = new EventEmitter<number>();


   @Output() show_for_genes_push: EventEmitter<string> = new EventEmitter<string>();
   @Output() show_for_genes_pop: EventEmitter<void> = new EventEmitter<void>();
   show_for_genes = ["TP53"];

   name_set1 = "S1";
   @Output() change_label_set1: EventEmitter<string> = new EventEmitter<string>();
   name_set2 = "S2";
   @Output() change_label_set2: EventEmitter<string> = new EventEmitter<string>();


  constructor() { }

  ngOnInit() {
  }

  change_name_set1(event){
    this.name_set1 = event.target.value;
    this.change_label_set1.emit(event.target.value);
  }

  change_name_set2(event){
    this.name_set2 = event.target.value;
    this.change_label_set2.emit(event.target.value);
  }

  analyse_pre_click(){
    this.change_pre.emit();
    this.analyse_pre = ! this.analyse_pre;
  }

  analyse_post_click(){
    this.change_post.emit();
    this.analyse_post = ! this.analyse_post;
  }

  add_data_info_change(event){
    console.log(event.target.value);
    this.add_data_info.emit(event.target.value);
  }

  change_pre_marker_n(event){
    console.log("pre now looking at markers number: "+ event.target.value);
    this.pre_marker_no.emit(event.target.value);
  }

  change_post_marker_n(event){
    console.log("post now looking at markers number: "+ event.target.value);
    this.post_marker_no.emit(event.target.value);
  }

  change_similarity_n(event){
    console.log("similarity n now at: " + event.target.value);
    this.similarity_n.emit(event.target.value);
  }

  change_pre_expr_n(event){
    this.pre_expr_no.emit(event.target.value);
  }

  change_post_expr_n(event){
    this.post_expr_no.emit(event.target.value);
  }

  add_gene(event){
    this.show_for_genes.push(event.target.value);
    console.log("added "+ event.target.value);
    this.show_for_genes_push.emit(event.target.value);
    event.target.value = '';
  }

  undo_gene(){
    this.show_for_genes.pop();
    this.show_for_genes_pop.emit();
  }

}
