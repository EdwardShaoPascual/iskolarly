# json library
library('rjson')
library('arules')
# get arguments of cli
args <- commandArgs(trailingOnly = TRUE)
json_file <- fromJSON(file='activity.json')
# json_file <- fromJSON(args)

json_file <- lapply(json_file, function(x) {
  x[sapply(x, is.null)] <- NA
  unlist(x)
})
df <- data.frame(do.call("rbind", json_file))

relation <- apriori(df, parameter=list(minlen=3))
relation <- sort(relation, decreasing = TRUE, na.last = NA, by = "support")
support <- capture.output(inspect(relation))
print(support[1:6])
write(support[], 'inspect_supp.txt');

relation <- apriori(df, parameter=list(minlen=3))
relation <- sort(relation, decreasing = TRUE, na.last = NA, by = "lift")
conf <- capture.output(inspect(relation))
print(conf[1:6])
write(conf[], 'inspect_lift.txt');

output <- list(result = "OK!")
print(toJSON(output))