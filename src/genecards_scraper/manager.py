from flask import Flask
from flask_cors import CORS
from genecards_scraper import get_top_n
from get_group_table_clusters import main
from similarity_raw_avg import main_sim, main_sim_reverse, gene_expression
from similarity_raw_avg import top_expressed_genes
from similarity_raw_avg import readMappingData
from cluster_info import cluster_size
import json
import re
import gc

app = Flask(__name__)
CORS(app)

@app.route("/output")
def output():
	return "Hello World!"

@app.route("/similarity/<n>")
def similarity(n):
	main()
	print("got gr tables.")
	gc.collect()
	return json.dumps(main_sim(int(n)))

@app.route("/rev_similarity/<n>")
def revsimilarity(n):
	main()
	print("got gr tables.")
	gc.collect()
	return json.dumps(main_sim_reverse(int(n)))


@app.route("/gene/expr/<genelist>")
def geneexpr(genelist):
	result = genelist.split(',')
	print(result)
	return json.dumps(gene_expression(result))

@app.route("/genes/<n>/file/<file>")
def genes(n,file):
	cluster_dict =  get_top_n(int(n),"../files/" + file)
	to_return = {}
	for cluster_id in cluster_dict:
		gene_dict = cluster_dict[cluster_id]
		to_return.update({str(cluster_id): str(gene_dict)})
	#print(cluster_dict)
	return json.dumps(to_return)

@app.route("/cluster_size/<set>")
def clusterSize(set):
	main()
	return json.dumps(cluster_size(set))


@app.route("/top_genes/<n>/<set>")
def topGenes(n,set):
	dict = top_expressed_genes(int(n),set)
	to_return = {}
	for cluster_id in dict:
		gene_dict = dict[cluster_id]
		to_return.update({str(cluster_id): str(gene_dict)})
	return json.dumps(to_return)

if __name__ == "__main__":
	app.run()
