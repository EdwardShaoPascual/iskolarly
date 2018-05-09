all:
	npm install
	cd frontend
	bower install
	cd ..
	sudo apt-get update
	sudo apt-get install r-base r-base-dev
	sudo apt-get install r-cran-rjson