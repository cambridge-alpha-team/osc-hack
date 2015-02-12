OSC hack
========

Quick test HTTP server, because I can't get the Java one to work. Does two
things:

1. Serves static files from `unvisual-frontend`
2. Forwards `POST` requests to Sonic Pi using OSC. Supports running code &
   stopping everything.

The frontend is included as a git submodule, so make sure you `$ git clone --recursive`.

Install node.js. Then using Terminal or Git Bash, do:

$ npm install node-osc
$ node osctest.js

Browse to <http://localhost:8888/> and enjoy our glorious group project.
