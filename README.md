ISKOlarly
============

## Authors
> Eddie Ron Adolph A. Vallejos and John Edward P. Pascual

## About the Repository
```
A repository of Eddie Ron Adolph A. Vallejos and John Edward P. Pascual for their special problem about automation and behavioral analysis of online classrooms.
```
## Prerequisites

------------

```
* `sudo apt install npm`
* `sudo npm install -g nodemon`
* `sudo npm install -g gulp`
* `sudo npm install -g bower`
* `sudo npm install -g n`
* `sudo n stable` This part makes sure that our NodeJS version is the stable one.
* The command "sudo n latest" will download the latest version of Node.js and if the version is not the latest after running the command, run `sudo ln -sf /usr/local/n/versions/node/7.7.2/bin/node /usr/bin/node`
```
------------
## Command(s)
------------
```
* `git clone https://github.com/EddieVallejos/iskolarly.git`
* `cd iskolarly`

To obtain packages that the back-end will be using..
* `npm install`

To obtain packages that the front-end will be using..
* `cd frontend`
* `bower install`

To add npm packages to package.json..
* `npm install --save <package>`

To add npm packages to bower.json..
* `bower install <package> --save`

If session does not work with the app..
* `sudo apt install redis-server`
```

## To start the web server
------------
```
* `npm start` or `sudo npm start` 

then check http://localhost:8000
```