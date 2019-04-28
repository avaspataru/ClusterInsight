import selenium
from selenium import webdriver
import bs4 #Parse/beautify html
import time
from selenium.webdriver.chrome.options import Options
import pandas as pd
import pickle


options = Options()
options.headless = True

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


def get_info(gene, driver):


    #gene = 'neat1'
    print(">> Requesting gene information for "+gene+"\n")
    url = 'https://www.genecards.org/cgi-bin/carddisp.pl?gene='+gene
    driver.get(url)


    #info = driver.find_element_by_class_name('gc-subsection')
    try:
        info_parent = driver.find_element_by_xpath("//section[@id='summaries']//div[@class='gc-subsection']//ul//li//p")
        tx = info_parent.get_attribute('innerHTML')
    except:
        tx = "Not much information available."

    return tx

def get_info_list(gene_list):
    gene_dict = {}

    saved_genes = pickle.load( open( "genedefs.p", "rb" ) )

    for gene in gene_list:
        if not (gene in saved_genes):
            driver = webdriver.Chrome(options=options)
            info = get_info(gene, driver)
            driver.quit()
            saved_genes.update({gene: info})
        else:
            info = saved_genes[gene]
        gene_dict.update({gene : info})
    pickle.dump(saved_genes,open('genedefs.p','wb'))
    return gene_dict

def get_top_n(top_n, fileName):
    print("Parsing data file")
    scaled_df, df = readClusterData(fileName)

    print("Finished parsing")
    clusters = scaled_df['cluster_id'].unique()

    cluster_dict={}
    for cluster_id in clusters:
        gene_dict = {}
        cluster_df = scaled_df.loc[scaled_df['cluster_id'] == cluster_id]
        if(top_n==-1):
            top_genes = cluster_df['gene'].unique()
        else:
            top_genes = cluster_df.nlargest(top_n,'avg_expr')
        gene_list = top_genes['gene'].unique()
        #gene_list=['tp53', 'neat1', 's100a4']
        gene_dict = get_info_list(gene_list)
        cluster_dict.update({cluster_id: gene_dict})
    return cluster_dict
