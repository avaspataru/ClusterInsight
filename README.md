# ClusterInsight
Application which automatically generates a report for explaining the classification of cells from a DGE matrix, made via Seurat.

## What it does 
Based on user uploaded files (containing the cell-type classification), and some user preferences, it generates a report containing much-needed information for understanding the classification. The tool has sucessfully been used to make sense of various groupings by looking at the genes these express and their roles. 

## How it works 
ClusterInsight has a number of features aimed at helping the user understand the data and the classification in a faster manner than having to manually write scripts to compute certain applications and research meaning of genes. These features are outlined below.

### 1. Additional information.
The user is allowed to put personalized labels on the datasets and add any information they wish to add to the report, such as provenience of the data and extraction dates. The purpose of this feature is to make the report clear to read.\\
\newline

### 2. Similarity measurements.
This feature is aimed at facilitating a mapping between clusters of the two uploaded datasets. The need for this feature came from the fact that, to map clusters, most analysts will only glance over marker genes and determine if they are the same. A more detailed analysis of this problem can be found in section 6 (Cell-type progression) of this report. This section also covers the formula used by ClusterInsight in detail, while also providing a template for interpretation of results with the aid of an example.

ClusterInsight produces heatmaps showing percentages of similarity between pairs of clusters from the two datasets. Since the formula used is not symmetric, two such heatmaps are produced, showing comparison from dataset 1 to dataset 2 and viceversa. Alongst with the application of the formula, the produced report shows the sizes of each cluster in terms of cells, to help interpret the results. 

The formula used to determine the similarity requires a parameter N (explained in section 6.4 of this report). This parameter can be adjusted in the Settings manager component of ClusterInsight. 

The ``Similarity'' section of the outputted report is written by simply calling upon a script in the back-end which runs the similarity formula on the uploaded files. The results are then returned as a pair of matrices to the front-end, which parses them and displays them in the shape of heatmaps. The script has also been made available, in a version that prints out the results to the console, without any friendly user interface. \\

### 3. Marker gene expression.
This feature focuses on helping the user investigate the marker genes of each cluster, by allowing them to print a number of the top marker genes and their raw average expression per cluster cell. ClusterInsight also allows for the user to input names of possible marker genes and look up the raw average expression of them in each cluster. By default, the report will show raw average expressions of gene TP53 (strongly correlated to cancer). 

The parameters for these features - the number of top marker genes to show and the gene names to check as markers - can be modified using the Settings manager. If the user wishes to display all marker genes for each cluster, rather than a number of top ones, they can set the parameter to value -1.

To generate this section, the report writer sends a request to the back-end, which analyses the uploaded files and sends the results back to the front-end. The analysis of the files in the back-end is not complicated, since it only looks at expression of genes and aggregates results to then display. \\

### 4. Gene definitions.
ClusterInsight automatically provides definitions for a number of top marker genes for each cluster. These are printed in the final section of the output report and the number representing how many genes to search for definitions can be adjusted in the Settings manager component.

The system back-end contains a web-scraper for a known online gene library, named GeneCards. The application will send requests to the GeneCards library and retrieve the definition for the marker genes. In order to make this process faster and stop the application from sending numerous repetitive requests, all the definitions already retrieved are cached. ClusterInsight first requests the definition for each gene name to the caching system and if the gene was never queried before, it will send an HTTP request to GeneCards. The use-case diagram in figure \ref{fig:usecase} shows how the gene definitions are retrieved and the actions of the system.

## Technologies 
The application was developed in two parts: front-end and back-end, which communicate through HTTP requests. One relevant hidden component of the system is the local cache, which holds the files uploaded by the user and a dictionary of gene definitions that were already retrieved from GeneCards.

The front-end was written using Angular and its purpose is to interact with the user and transmit formatted requests to the back-end. The front-end keeps track of all the settings set by the user and renames the files uploaded to conform to the standards of the back-end. The reason behind using Angluar as the main technology is that it was very well suited to the component structure, since it has an in-build component system. The interface is user-focused, allowing for fast generation of the report and hiding all the heavy-computation in the back-end. In terms of interface design, the application structure was inspired from other report writing web application, such as Overleaf. 

The back-end was written using Python and its purposes is to parse and manipulate data obtained from the files uploaded by the user. The back-end consists of a main ``manager'' script which listens from requests from the front-end. When a request is retrieved, it contains information about the type of request (similarity result, marker gene name, gene definitions list etc) and the corresponding parameters. The ``manager'' parses the request and sends the relevant information to the script specific to the type of request. After the script is run, the results are formatted and sent to the front-end by the ``manager''. The reason behind using Python for the back-end is twofold. Firstly, it allows for fast and easy manipulation of large dataframes (such as the ones that need to be analysed). Secondly, it has in-built packages for sending & retrieving HTTP requests, as well as packages to facilitate caching (such as pickle).

The local cache consists of copies of the user uploaded files and a pickle file for the gene definitions. The user files are parsed upon request to generate the needed information. The pickle file consists of a dictionary with the key being the name of the gene and the value being the definition. This allowed for fast retrieval of gene definition as well as fast checking for already defined genes, before sending the HTTP request to genecards. 

The application is not yet deployed, but it will be used by the ovarian cancer research project at the University of Warwick. The reason behind not deploying at the moment is that it fulfills very specific purposes and it is aimed at specialised users, which already know and understand the similarity formula and all the other features offered by ClusterInsight.
