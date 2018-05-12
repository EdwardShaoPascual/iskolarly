all:
	npm install
	sudo npm install -g shelljs
	sudo apt-get update
	sudo apt-get install r-base r-base-dev
	sudo apt-get install r-cran-rjson