import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @Input() data_info: string;
  @Input() analyse_pre:boolean;
  @Input() analyse_post:boolean;
  @Input() pre_marker_no:number;
  @Input() post_marker_no:number;
  @Input() similarity_n:number;
  @Input() pre_expr_no:number;
  @Input() post_expr_no:number;
  @Input() show_for_genes;
  @Input() label_set1:string;
  @Input() label_set2:string;

  @Output() download_event:EventEmitter<void> = new EventEmitter<void>();

  public post_genes;
  public post_genes_dict;

  public post_clusters;
  public post_clusters_dict;
  public gene_defs;
  public isloading:boolean = false;

  public pre_genes;
  public pre_genes_dict;

  public pre_clusters;
  public pre_clusters_dict;

  public pre_clusters_no:number = 0;
  public post_clusters_no:number =0;

  public losses = [];
  public matches = [];
  public rev_losses = [];
  public rev_matches = [];
  public common_genes=[];

  public pre_cluster_sizes;
  public post_cluster_sizes;

  public pre_top_genes = [];
  public pre_top_genes_dict = [];
  public post_top_genes = [];
  public post_top_genes_dict = [];

  public gene_expr_dict;

  public color_map = ["#D90025","#D51A00","#D25900", "#CE9500", "#C5CA00", "#85C600", "#48C200", "#0DBF00"];
  constructor(private http: HttpClient) { }

  getTopGenes(){
    var my_url = 'http://127.0.0.1:5000/top_genes/'+this.pre_expr_no+'/pre';
    this.isloading = true;
    this.http.get(my_url).subscribe( res => {
      this.pre_top_genes = []
      this.pre_top_genes_dict = [];
      for(let j in res){
        var parsed = "";
        for(let i of res[j]){
          if(i=="'")
            parsed += '"';
          else
            parsed += i;
        }
        var p_parsed = JSON.parse(parsed);
        console.log("printing parsed");
        var keys = []
        for(let p in p_parsed)
          keys.push(p);
        this.pre_top_genes.push(keys);
        this.pre_top_genes_dict.push(p_parsed);
      }
      this.isloading = false;
    });

    var my_url = 'http://127.0.0.1:5000/top_genes/'+this.post_expr_no+'/post';
    this.isloading = true;
    this.http.get(my_url).subscribe( res => {
      this.post_top_genes = []
      this.post_top_genes_dict = [];
      for(let j in res){
        var parsed = "";
        for(let i of res[j]){
          if(i=="'")
            parsed += '"';
          else
            parsed += i;
        }
        var p_parsed = JSON.parse(parsed);
        console.log("printing parsed");
        var keys = []
        for(let p in p_parsed)
          keys.push(p);
        this.post_top_genes.push(keys);
        this.post_top_genes_dict.push(p_parsed);
      }
      this.isloading = false;
    });

  }

  get_cluster_id(indx){
    if(indx < this.pre_clusters_no)
      return this.label_set1+"_"+indx;
    return this.label_set2+"_"+(indx-this.pre_clusters_no);
  }

  get_express(expr){


    if(expr==-1)
      return "NA";
    return expr.toFixed(2);
  }

  getSelectedGenes(){
    var my_url =  'http://127.0.0.1:5000/gene/expr/'+this.show_for_genes;
    this.isloading = true;
    this.http.get(my_url).subscribe( res => {
      console.log(res);
      console.log(res["TP53"]);
      this.gene_expr_dict = res;
      this.isloading = false;
    });
  }

  getsizes(){
    var my_url =  'http://127.0.0.1:5000/cluster_size/pre';
    this.isloading = true;
    this.http.get(my_url).subscribe( res => {
      this.pre_cluster_sizes = res;
      this.isloading = false;
    });
    var my_url =  'http://127.0.0.1:5000/cluster_size/post';
    this.isloading = true;
    this.http.get(my_url).subscribe( res => {
      this.post_cluster_sizes = res;
      this.isloading = false;
    });
  }

  change(gene_dict){
    var changed_gene_dict = "";
    for(let i = 0; i<gene_dict.length;i++){
        if(gene_dict[i]=="'" && gene_dict[i-1]=="{"){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i]=="'" && gene_dict[i+1]=="}"){
            changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i+1] == ' ' && gene_dict[i+2] == ','){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i+1] == ' ' && gene_dict[i+2] == ':'){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i+1] == ':'){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i-1] == ' ' && gene_dict[i-2] == ':'){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i-1] == ' ' && gene_dict[i-2] == ','){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i-1] == ']' && gene_dict[i+1] == ','){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i+1] == ', ' && gene_dict[i+2] == ' ' && gene_dict[i+3]=="'"){
          changed_gene_dict+='"';
          continue;
        }
        if(gene_dict[i] =="'" && gene_dict[i-1] == '.' && gene_dict[i+1] == ","){
          changed_gene_dict+='"';
          continue;
        }

        changed_gene_dict+=gene_dict[i];
    }
    return changed_gene_dict;
  }

  get_color(i){
    if(this.matches[i]>=70)
      return this.color_map[7];
    return this.color_map[Math.floor(this.matches[i]/10)];
  }

  get_value(i){
    if(i%(this.post_clusters_no+1) == 0)
      return "indx";
    var minus = i - ( Math.floor(i/ (this.post_clusters_no+1)) +1);
    console.log(i + " goes to " + minus);
    return this.losses[minus]+ "("+ this.matches[minus] +"%)"; //{{item}} ({{matches[i]}}%)
  }

  get_rev_color(i){
    if(this.rev_matches[i]>=70)
      return this.color_map[7];
    return this.color_map[Math.floor(this.rev_matches[i]/10)];
  }

  get_color_code(i){
    if(i>=70)
      return this.color_map[7];
    return this.color_map[Math.floor(i/10)];
  }

  compare_genes(){
    this.common_genes = []
    var genes_pre;
    for(let cluster_id in this.pre_clusters){
      var genes = this.pre_clusters_dict[cluster_id];
      for(let gene of genes)
        genes_pre[gene]= cluster_id;
    }

    var genes_post ;
    for(let cluster_id of this.post_clusters){
      var genes = this.post_clusters_dict[cluster_id];
      for(let gene in genes)
        genes_post[gene]= cluster_id;
    }

    for(let gene of genes_pre){
      for(let gene2 of genes_post){
        if(gene == gene2){
          this.common_genes[gene]= (genes_pre[gene],genes_post[gene]);
        }
      }
    }
    console.log(this.common_genes);
  }

  update_post_genes(){
    this.isloading = true;
    var my_url = 'http://127.0.0.1:5000/genes/'+ this.post_marker_no + '/file/' + 'post_gene.txt';

    this.http.get(my_url).subscribe( res => {
      let keys = [];
      for (let key in res) {
        keys.push(key);
      }
      this.post_clusters = keys;
      this.post_clusters_dict = {};

      for(let cluster_id in this.post_clusters){
        var gene_dict = res[cluster_id];

        gene_dict = this.change(gene_dict);
        gene_dict = JSON.parse(gene_dict);
        //this.post_clusters_dict[cluster_id] = gene_dict;
        var gene_list = [];
        for(let gene in gene_dict){
         gene_list.push(gene);
          this.gene_defs[gene] = gene_dict[gene];
        }
        console.log(gene_list);
        this.post_clusters_dict[cluster_id] = gene_list;
      }

      this.isloading = false;
      this.getsizes();
      this.getTopGenes();
      this.getSelectedGenes();
      if(this.analyse_pre == true){ //both are analysed - can compare
          this.compare_genes();
      }

    });
  }


  update_pre_genes(){
    this.isloading = true;
    var my_url = 'http://127.0.0.1:5000/genes/'+ this.pre_marker_no + '/file/' + 'pre_gene.txt';

    this.http.get(my_url).subscribe( res => {
      let keys = [];
      for (let key in res) {
        keys.push(key);
      }
      this.pre_clusters = keys;
      this.pre_clusters_dict = {};

      for(let cluster_id in this.pre_clusters){
        var gene_dict = res[cluster_id];

        gene_dict = this.change(gene_dict);
        gene_dict = JSON.parse(gene_dict);

        var gene_list = [];
        for(let gene in gene_dict){
          console.log(gene);
         gene_list.push(gene);
          this.gene_defs[gene] = gene_dict[gene];
        }
        this.pre_clusters_dict[cluster_id] = gene_list;
      }

      if(this.analyse_post == true)
        this.update_post_genes();
      else{
        this.isloading = false;
      }
    });
  }


  ngOnInit() {
    this.update();

  }

  update_similarity(){
    if(this.analyse_pre==true && this.analyse_post==true){
      console.log("update similarity with n ", this.similarity_n);
      var my_url =  'http://127.0.0.1:5000/similarity/'+ this.similarity_n;
      this.isloading = true;
      this.http.get(my_url).subscribe( res => {
        this.losses=[]
        this.post_clusters_no = 0;
        this.pre_clusters_no = 0;
        for(let i in res[0]){
          for( let j in res[0][i]){
            this.losses.push(res[0][i][j]);
            this.post_clusters_no ++;
          }
          this.pre_clusters_no++;
        }
        this.post_clusters_no = this.post_clusters_no / this.pre_clusters_no;
        this.matches=[]
        for(let i in res[1])
          for( let j in res[1][i])
            this.matches.push(res[1][i][j]);

        this.update_rev_similarity();
      });
    }
  }

  update_rev_similarity(){
    if(this.analyse_pre==true && this.analyse_post==true){
      console.log("update similarity with n !", this.similarity_n);
      var my_url =  'http://127.0.0.1:5000/rev_similarity/'+ this.similarity_n;
      this.isloading = true;
      this.http.get(my_url).subscribe( res => {
        console.log("got response?");
        this.rev_losses=[]
        for(let i in res[0]){
          for( let j in res[0][i]){
            this.rev_losses.push(res[0][i][j]);
          }
        }
        console.log("matches?");
        this.rev_matches=[]
        for(let i in res[1])
          for( let j in res[1][i])
            this.rev_matches.push(res[1][i][j]);

        console.log("parsed rev");
        this.update();
      });
    }
  }

  update(){
    this.gene_defs = {};
    console.log("Update " + this.analyse_pre + this.analyse_post);
    if(this.analyse_pre == true)
      this.update_pre_genes();
    else{
      if(this.analyse_post == true)
        this.update_post_genes();
    }
  }

  download(){
    console.log("emit");
    this.download_event.emit();
  }

}
