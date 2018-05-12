# json library
library('rjson')
library('arules')
# get arguments of cli
# args <- commandArgs(trailingOnly = TRUE)
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

relation <- apriori(df, parameter=list(minlen=3))
relation <- sort(relation, decreasing = TRUE, na.last = NA, by = "lift")
lift <- capture.output(inspect(relation))
# ================================== SUPPORT ==================================
return_support <- c()
final_support <- c()
for (index in 2:length(support)) {
  supplist <- strsplit(support[index], '\\s')
  for (i in 2:length(supplist[[1]])) {
    if (supplist[[1]][i] != "") {
      return_support <- c(return_support, supplist[[1]][i])
    }
  }
}
flag <- 0
str <- ""
for (index in 1:length(return_support)) {
  if (grepl('{', return_support[index], fixed=TRUE) && grepl('}', return_support[index], fixed=TRUE)) {
    flag <- 2
  } else if (grepl('}', return_support[index], fixed=TRUE)) {
    flag <- 0
  } else if (grepl('{', return_support[index], fixed=TRUE)){
    flag <- 1
  }

  if (flag == 1) {
    str <- paste(str, return_support[index], sep="")
  } else if (flag == 2) {
    str <- return_support[index]
    final_support <- c(final_support, str)
    str <- ''
  } else {
    str <- paste(str, return_support[index], sep="")
    final_support <- c(final_support, str)
    str <- ""
  }
  
}
return_support <- c()
str <- ''
for (index in seq(1,length(final_support), 7)) {
  str <- paste(paste(paste(paste(str, final_support[index], sep=""), final_support[index+1]),final_support[index+2]), final_support[index+3])
  return_support <- c(return_support, str)
  str <- ''
}
write(return_support, 'inspect_supp.txt');

# ================================== LIFT ==================================
return_lift <- c()
final_lift <- c()
for (index in 2:length(lift)) {
  supplist <- strsplit(lift[index], '\\s')
  for (i in 2:length(supplist[[1]])) {
    if (supplist[[1]][i] != "") {
      return_lift <- c(return_lift, supplist[[1]][i])
    }
  }
}
flag <- 0
str <- ""
for (index in 1:length(return_lift)) {
  if (grepl('{', return_lift[index], fixed=TRUE) && grepl('}', return_lift[index], fixed=TRUE)) {
    flag <- 2
  } else if (grepl('}', return_lift[index], fixed=TRUE)) {
    flag <- 0
  } else if (grepl('{', return_lift[index], fixed=TRUE)){
    flag <- 1
  }
  
  if (flag == 1) {
    str <- paste(str, return_lift[index], sep="")
  } else if (flag == 2) {
    str <- return_lift[index]
    final_lift <- c(final_lift, str)
    str <- ''
  } else {
    str <- paste(str, return_lift[index], sep="")
    final_lift <- c(final_lift, str)
    str <- ""
  }
  
}
return_lift <- c()
str <- ''
for (index in seq(1,length(final_lift), 7)) {
  str <- paste(paste(paste(paste(str, final_lift[index], sep=""), final_lift[index+1]),final_lift[index+2]), final_lift[index+5])
  return_lift <- c(return_lift, str)
  str <- ''
}
write(return_lift, 'inspect_lift.txt');
