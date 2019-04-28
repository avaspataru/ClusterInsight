import numpy as np
import pandas as pd
import pickle
import gc

def readData(file):
    fp = open( file, 'r')
    line = fp.readline() #ignore headers
    cellIDs = line.split()
    cellIDs.pop(0)

    genes = []
    rows = []

    line = fp.readline()
    while line:
        line = line.split()
        gene = line.pop(0)
        genes.append(gene)
        line = map(int, line)
        rows.append(line)

        line = fp.readline()
    df = pd.DataFrame(rows, columns = cellIDs)
    #print df
    return df, genes, cellIDs

def readClusterData(fileName):
    fp = open( fileName, 'r')

    line = fp.readline() #ignore headers
    cnt = 1
    array = []
    while line:
       line = fp.readline()
       if(line == "$$$$\n"): # have finished the scaled expressions
            d = ['gene', 'cluster_id', 'avg_expr']
            df_scaled = pd.DataFrame(array, columns=d)
            array = []
            line = fp.readline() # skip \n
            line = fp.readline() # skip headers
            continue
       if (line == ""):
           continue
       qcnt = 0 #number of "
       dcnt = 0 #number of $
       cluster_id_s = ""
       gene = ""
       avg_expr_s = ""
       for c in line:
          if c == '"':
              qcnt=qcnt+1
              continue
          if c == '$':
              dcnt=dcnt+1
              continue
          if c== ' ':
              continue
          if(qcnt == 3 and dcnt == 0): #in gene name
              gene = gene +c
          if(qcnt == 3 and dcnt == 1 ): #in cluster id
              cluster_id_s = cluster_id_s + c
          if(qcnt == 3 and dcnt == 2 ): # in avg value
              avg_expr_s = avg_expr_s + c
       avg_expr = float(avg_expr_s)
       cluster_id = int(cluster_id_s)

       elem = [gene, cluster_id, avg_expr]
       array.append(elem)
       cnt += 1
    fp.close()
    print(line)

    d = ['gene', 'cluster_id', 'avg_expr']
    df = pd.DataFrame(array, columns=d)
    return df_scaled,df


def correctAvgExpr(df,clusters_df,genes,cellIDs):
    corrected_rows = []
    count = 0
    for i,row in clusters_df.iterrows():
        #recalculate the average expression
        sum = 0
        # WE NEED THE AVERAGE EXPRESSION IN EACH CLUSTER!!
        j = genes.index(row['gene'])
        r = df.iloc[j]
        sum = r.sum()

        corrected_row = [row['gene'], row['cluster_id'],(sum * 1.0) / len(cellIDs)]
        corrected_rows.append(corrected_row)
        count = count + 1
        if count%100 == 0:
            print("corrected " + str(count) + "/" + str(len(clusters_df.index)) + "genes.")
    return pd.DataFrame(corrected_rows, columns=['gene','cluster_id','avg_expr'])

def getCellsInCluster(clusterID, cell_cluster_map):
    cells = []
    for k in cell_cluster_map:
        if cell_cluster_map[k]==clusterID:
            cells.append(k)
    return cells

def correctAvgExprCluster(df,clusters_df,genes,cellIDs,cell_cluster_map):
    clusterIDs = clusters_df['cluster_id'].unique()
    corrected_rows = []

    for i,row in clusters_df.iterrows():
        #recalculate the average expression
        cluster_cellIDs = getCellsInCluster(row['cluster_id'],cell_cluster_map)
        cluster_df = df[cluster_cellIDs]
        #print cluster_df
        sum = 0
        j = genes.index(row['gene'])
        r = cluster_df.iloc[j]
        sum = r.sum()

        corrected_row = [row['gene'], row['cluster_id'],(sum * 1.0) / len(cellIDs)]
        corrected_rows.append(corrected_row)


    return pd.DataFrame(corrected_rows, columns=['gene','cluster_id','avg_expr'])


def similarities(pre_scaled_data, post_scaled_data, pre_data, post_data,top_n):
    pre_clusters = pre_data['cluster_id'].unique()
    post_clusters = post_data['cluster_id'].unique()

    loss_matrix = [[0 for x in range(len(post_clusters))] for y in range(len(pre_clusters))]
    matching_matrix = [[0 for x in range(len(post_clusters))] for y in range(len(pre_clusters))]
    for i in pre_clusters:
        print("-------------------------------------------------------------------")
        losses = []

        for j in post_clusters:
            pre_cluster = pre_data.loc[pre_data['cluster_id'] == i]
            post_cluster = post_data.loc[post_data['cluster_id']==j]

            if(top_n == -1):
                lookup_genes = pre_cluster['gene'].unique()
            else:
                p_cluster = pre_scaled_data.loc[pre_scaled_data['cluster_id'] == i]
                top_genes = p_cluster.nlargest(top_n,'avg_expr')
                lookup_genes = top_genes['gene'].unique()
            loss = 0
            ngene = lookup_genes.size
            worst_case = 0
            #print(lookup_genes)
            for gene in lookup_genes:
                avg_expr_pre = pre_cluster.loc[pre_cluster['gene'] == gene]['avg_expr'].item()
                worst_case = worst_case + avg_expr_pre
                if(post_cluster.loc[post_cluster['gene'] == gene].empty): #gene doesn't exist in post cluster
                    #print gene + " " + str(avg_expr_pre) + " 0"
                    loss = loss + avg_expr_pre
                    continue

                avg_expr_post = post_cluster.loc[post_cluster['gene'] == gene]['avg_expr'].item()
                #print gene + " " + str(avg_expr_pre) + " " + str(avg_expr_post)
                if(avg_expr_post<=avg_expr_pre):
                    loss = loss + (avg_expr_pre - avg_expr_post)

            loss = loss / ngene
            worst_case = worst_case / ngene
            loss = loss * 1000
            worst_case = worst_case * 1000
            losses = losses + [loss]
            percent_match = 100 - (loss * 100.0 / worst_case)

            loss_matrix[i][j] = round(loss,2)
            matching_matrix[i][j] =round(percent_match,2)

            print("compare pre_" + str(i) + ", post_" + str(j) + ": loss " + str(round(loss,2)) + " ("+ str(round(percent_match,2))+"% match); looked at " + str(ngene) + " genes.")

    return loss_matrix, matching_matrix

def readMappingData(fileName):
    fp = open( fileName, 'r')
    line = fp.readline()
    map = {}
    while line:
        cellID = ""
        clusterID = ""
        seen = False
        for c in line:
            if c == '-':
                seen = True
                continue
            if seen == False:
                cellID = cellID + c
            else:
                clusterID = clusterID +c
        map[cellID] = int(clusterID)
        line = fp.readline()

    fp.close()
    return map


def saveCorrections(file, df):
    fout = open(file, "w")
    fout = open(file, "a")

    for i, row in df.iterrows():
        fout.write(str(row['gene']) + "$" + str(row['cluster_id']) + "$" + str(row['avg_expr']) + "\n")
    fout.close()

def readSavedData(file):
    print("Reading saved data")
    fp = open(file, "r")
    line = fp.readline()
    rows = []
    while len(line)!=0:
        countSep = 0
        gene = ""
        cluster_id = ""
        avg_expr = ""
        for c in line:
            if c=="$":
                countSep = countSep + 1
                continue
            if c=='\n':
                continue
            if countSep==0:
                gene = gene + c
            if countSep==1:
                cluster_id = cluster_id + c
            if countSep==2:
                avg_expr = avg_expr + c
        row = [gene,int(cluster_id),float(avg_expr)]
        rows.append(row)
        line = fp.readline()
    df = pd.DataFrame(rows, columns=['gene','cluster_id','avg_expr'])
    fp.close()
    return df


def gene_expression(gene_list):
    pre_clusters_scaled,pre_clusters_df = readClusterData('../files/pre_gene.txt')
    post_clusters_scaled,post_clusters_df = readClusterData('../files/post_gene.txt')
    dict = {}
    for gene in gene_list:
        expressions = [-1 for i in range(0,len(pre_clusters_df['cluster_id'].unique())+len(post_clusters_df['cluster_id'].unique()))]

        markers = pre_clusters_df.loc[pre_clusters_df['gene']==gene]
        for i,r in markers.iterrows():
            cluster = r['cluster_id']
            avg_expr = r['avg_expr']
            expressions[cluster] = avg_expr
        markers = post_clusters_df.loc[post_clusters_df['gene']==gene]
        for i,r in markers.iterrows():
            cluster = r['cluster_id']
            avg_expr = r['avg_expr']
            expressions[cluster + len(pre_clusters_df['cluster_id'].unique()) ] = avg_expr
        dict.update({gene: expressions})
        print(gene,expressions)
    return dict


def top_expressed_genes(top_n, set):
    clusters_scaled,clusters_df = readClusterData('../files/'+set+'_gene.txt')

    clusters = clusters_df['cluster_id'].unique()

    dict = {}
    for i in clusters:
        cluster = clusters_df.loc[clusters_df['cluster_id'] == i]
        top_genes = cluster.nlargest(top_n,'avg_expr')

        cluster = i
        genes = {}
        for j,gene in top_genes.iterrows():
            obj = (gene['gene'], gene['avg_expr'])
            genes.update({gene['gene']: gene['avg_expr']});
        dict.update({cluster: genes})

    return dict

def main_sim_reverse(top_n):
    pre_clusters_scaled,pre_clusters_df = readClusterData('../files/pre_gene.txt')
    post_clusters_scaled, post_clusters_df= readClusterData('../files/post_gene.txt')

    pre_cell_cluster_map =  readMappingData('../files/pre_group_table.txt')
    post_cell_cluster_map = readMappingData('../files/post_group_table.txt')

    print("Finished all reading")


    return similarities(post_clusters_scaled, pre_clusters_scaled,post_clusters_df, pre_clusters_df,top_n)

def main_sim(top_n):
    #cells are columns, genes are rows

    #gene cluster id avg expr -- corrected to actual (non scaled values)
    pre_clusters_scaled,pre_clusters_df = readClusterData('../files/pre_gene.txt')
    post_clusters_scaled, post_clusters_df= readClusterData('../files/post_gene.txt')

    pre_cell_cluster_map =  readMappingData('../files/pre_group_table.txt')
    post_cell_cluster_map = readMappingData('../files/post_group_table.txt')

    print("Finished all reading")


    return similarities(pre_clusters_scaled, post_clusters_scaled,pre_clusters_df, post_clusters_df,top_n)
