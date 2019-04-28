from similarity_raw_avg import readMappingData

def cluster_size(set):
	cell_cluster_map =  readMappingData('../files/'+set+'_group_table.txt')
	clusters = []
	for cl in list(cell_cluster_map.values()):
		if cl not in clusters:
			clusters.append(cl)
	sizes = {}
	for id in clusters:
		size = 0
		for cell, cid in cell_cluster_map.items():
			if(cid == id):
				size = size + 1
		sizes.update({id: size})
	return sizes
