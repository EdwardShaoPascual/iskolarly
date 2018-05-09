# json library
library('rjson')
library('arules')
 
# function to call
sumFunc <- function (num1, num2){
  sum(num1, num2)
}
 
# get arguments of cli
# args <- commandArgs(trailingOnly = TRUE)

json_file <- 
'[{"name":"Doe, John","group":"Red","age":24,"height":182,"wieght":74.8,"score":500},
{"name":"Doe, Jane","group":"Green","age":30,"height":170,"wieght":70.1,"score":500},
{"name":"Smith, Joan","group":"Yellow","age":41,"height":169,"wieght":60,"score":500},
{"name":"Brown, Sam","group":"Green","age":22,"height":183,"wieght":75,"score":865},
{"name":"Jones, Larry","group":"Green","age":31,"height":178,"wieght":83.9,"score":221},
{"name":"Murray, Seth","group":"Red","age":35,"height":172,"wieght":76.2,"score":413},
{"name":"Doe, Jane","group":"Yellow","age":22,"height":164,"wieght":68,"score":902}]'
 
# arguments to JSON
json_file <- fromJSON(file = "/home/eddie/Documents/SP/iskolarly/backend/scripts/activity.json")

json_file <- lapply(json_file, function(x) {
  x[sapply(x, is.null)] <- NA
  unlist(x)
})
df <- data.frame(do.call("rbind", json_file))
print(df)

relation <- apriori(df);
inspect(relation);
