
# dataobj = Seurat object containing the analysed pre-treatment data

#INSTRUCTIONS: Run this file with dataobj being the Seurat object you wish to analyse further.
#This script will produce 2 text files called: "genesClusters.txt" and "cellClusters.txt".
#These files contain the information needed to further analyse the data using this software.
#Please upload the files to the website (genesClusters.txt and cellClusters.txt)

#cell cluster assignments
clusterassignments = GetClusters(dataobj)
cell_clusters = paste(clusterassignments$cell.name, "-",clusterassignments$cluster)
write.table(cell_clusters, "cellClusters.txt", append = FALSE, sep = " ", dec = ".", row.names = TRUE, col.names = TRUE)

#marker genes for each cluster

##print in the file [gene$cluster$avglogFC, gene-avglogFC ...] to get the top markers

markers = paste(dataobj.markers$gene, "$",dataobj.markers$cluster, "$", dataobj.markers$avg_logFC)
write.table(markers, "genesClusters.txt", append = FALSE, sep = " ", dec = ".", row.names = TRUE, col.names = TRUE)

write("$$$$\n",file="genesClusters.txt",append=TRUE)

genes = dataobj.markers$gene
clusters = dataobj.markers$cluster
avg_expres = c()
total_reads = sum(dataobj@raw.data)

print(total_reads)

#Get raw average expressions for genes in genes=dataobj.markers$gene
index = 1
for( gene in genes){
  cellsincluster = clusterassignments[clusterassignments$cluster == as.numeric(as.character(clusters[index])),]$cell.name
  index = index + 1
  expr = 0 #the expression of this gene in its cluster
  for( cell in cellsincluster){
    if(gene == "PIEZO2")
      print(dataobj@raw.data[gene,cell])
    expr = expr + dataobj@raw.data[gene,cell]
  }
  if(gene == "PIEZO2"){
    print("y ")
    print(expr)
    print(as.numeric(as.character(clusters[index])))
    print(length(cellsincluster))
  }
  expr = expr / length(cellsincluster)
  expr = expr * 100000 #to make sure the numbers aren't too low
  expr = expr / total_reads #library size scaling
  avg_expres <- c(avg_expres, expr)
}



genes_clusters = paste(dataobj.markers$gene, "$",dataobj.markers$cluster, "$", avg_expres)
write.table(genes_clusters, "genesClusters.txt", append = TRUE, sep = " ", dec = ".", row.names = TRUE, col.names = TRUE)
