library('rjson')

args <- commandArgs(trailingOnly = TRUE)

output <- list(result = getwd());
print(toJSON(output))
