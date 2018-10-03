'use strict'

const TManGPS = require('tman-gps')

var path    = require('path')

var express = require('express');
var app = express();

// Un middleware
var myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
};
  
app.use(myLogger);



app.use('/node_modules/p2p-graph/p2p-graph.min.js', express.static(path.join(__dirname, '/node_modules/p2p-graph/p2p-graph.min.js')))
app.use('/build', express.static(path.join(__dirname, '/node_modules/tman-gps/build/')))
app.use('/build', express.static(path.join(__dirname, '/node_modules/spray-wrtc/build/')))
app.use('/large.js', express.static(path.join(__dirname, '/node_modules/tman-wrtc/examples/large.js')))
app.use('/parent.js', express.static(path.join(__dirname, '/node_modules/tman-wrtc/examples/parent.js')))
app.use('/tmangps.js', express.static(path.join(__dirname, '/tmangps.js')))
app.use('/node_modules/cytoscape/dist/cytoscape.js', express.static(path.join(__dirname, '/node_modules/cytoscape/dist/cytoscape.js')))
app.use('/node_modules/spray-wrtc/build/spray-wrtc.bundle.debug.js', express.static(path.join(__dirname, '/node_modules/spray-wrtc/build/spray-wrtc.bundle.debug.js')))


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/tman-wrtc-large', (req, res)=>{
    res.sendFile(path.join(__dirname,'/node_modules/tman-wrtc/examples/large.html'))
    //res.send('./node_modules/tman-wrtc/examples/large.html')
})

app.get('/tman-wrtc-parent', (req, res)=>{
    res.sendFile(path.join(__dirname,'/node_modules/tman-wrtc/examples/parent.html'))
    //res.send('./node_modules/tman-wrtc/examples/large.html')
})

app.listen(3000);