const TManGPS = require('tman-gps');
const S = require('spray-wrtc');

let graphTMAN = new window.P2PGraph('#tman');
let graphParent = new window.P2PGraph('#parent');

var cy = cytoscape({
  container: document.getElementById('cy'), // container to render in

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'width': 3,
        'target-arrow-shape': 'triangle',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }
});

/*cy.add([
  { group: "nodes", data: { id: "n0" }, position: { x: 0, y: 0 } },
  { group: "nodes", data: { id: "n1" }, position: { x: 50, y: 50 } },
  { group: "edges", data: { id: "e0", source: "n0", target: "n1" } }
]);*/


let graph = new window.P2PGraph('.graph')



let N = 8

// #1 create N peers
let peers = []
let colors = []
let revertedIndex = new Map()

/*var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "16px Arial";*/

getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/*fillCircle = (x,y,text, color) => {
    ctx.beginPath();
    ctx.arc(x*100,y*50,20,0,2*Math.PI);
    ctx.strokeStyle=color;
    ctx.stroke();
    ctx.fillStyle=color;
    ctx.fillText(text, x*100-13, y*50+5);
}

fillLine = (x1,y1, x2, y2, color) => {
    
    ctx.moveTo(x1*100, y1*50);
    ctx.lineTo(x2*100, y2*50);

    ctx.strokeStyle=color;
    ctx.stroke()
}*/

newtman = (x,y, color) => {
    
    // fillCircle(x,y,`${x},${y}`, color)

    colors.push(color);

    let parent = new S({
      peer: `(${x},${y})`,
      delta: 3 * 1000,
      config: {trickle: true}})
    
    return new TManGPS({
        //Peer${Math.round(Math.random()*20+1)} 
        peer: `(${x},${y})`,
        descriptor: {x: x, y:y},
        delta: 2 * 1000,
        config: {trickle: true}
    },parent)
}




peers.push(newtman(1,7,getRandomColor()))
revertedIndex.set(peers[0].NI.PEER, peers[0])

peers.push(newtman(1,1,getRandomColor()))
revertedIndex.set(peers[1].NI.PEER, peers[1])

peers.push(newtman(2,7,getRandomColor()))
revertedIndex.set(peers[2].NI.PEER, peers[2])

peers.push(newtman(2,1,getRandomColor()))
revertedIndex.set(peers[3].NI.PEER, peers[3])

peers.push(newtman(10,1,getRandomColor()))
revertedIndex.set(peers[4].NI.PEER, peers[4])

peers.push(newtman(12,1,getRandomColor()))
revertedIndex.set(peers[5].NI.PEER, peers[5])

peers.push(newtman(10,7,getRandomColor()))
revertedIndex.set(peers[6].NI.PEER, peers[6])

peers.push(newtman(12,7,getRandomColor()))
revertedIndex.set(peers[7].NI.PEER, peers[7])

/*cy.add([
  { group: "nodes", data: { id: "n0" }, position: { x: 0, y: 0 } },
  { group: "nodes", data: { id: "n1" }, position: { x: 50, y: 50 } },
  { group: "edges", data: { id: "e0", source: "n0", target: "n1" } }
]);*/

for(let i=0; i<N; i++){
  cy.add([
    { group: "nodes", data: { id: peers[i].options.peer }, position: {
        x:peers[i].options.descriptor.x*80,
        y:peers[i].options.descriptor.y*80
    } }
  ]);
}

/*peers.push(newtman(4,12,getRandomColor()))
revertedIndex.set(peers[8].NI.PEER, peers[8])*/

/*setTimeout(()=>{
    // ctx.clearRect(0, 0, c.width, c.height);
    peers.forEach((peer, i)=>{
        const x =  Math.round(Math.random()*5+1);
        const y = Math.round(Math.random()*5+1);
        // fillCircle(x,y,`${x},${y}`, colors[i])
        peer.setDescriptor({
            x : x,
            y : y
        });
        
    })
}, 30*1000)*/


// #2 simulate signaling server
const callback = (from, to) => {
  return (offer) => {
    to.connect((answer) => { from.connect(answer) }, offer)
  }
}

// #3 peers join the network 1 by 1
for (let i = 1; i < N; ++i) {
  setTimeout((nth) => {
    const rn = Math.floor(Math.random() * nth)
    peers[nth].join(callback(peers[nth], peers[rn]))
  }, i * 1000, i)
};

/*setTimeout(()=>{
    console.log(peers[3].getPeers(2));
},20*1000)*/

var totalLinks = 0
var totalLinksParent = 0

for (let i = 0; i < N; ++i) {
  
    graphParent.add({
      id: peers[i].PEER,
      me: false,
      name: peers[i].options.peer
    })


    if(i==0){
      graph.add({
        id: peers[i].PEER,
        me: false,
        name: peers[i].options.peer
      })
    }else{
      graph.add({
        id: peers[i].PEER,
        me: false,
        name: peers[i].options.peer
      })
    }
    

  // console.log(graph.get(i));

  peers[i].on('open', (peerId) => {
    
    cy.add([
      { group: "edges", data: { id: `e${peers[i].options.peer}-${revertedIndex.get(peerId).options.peer}`, source: peers[i].options.peer, target: revertedIndex.get(peerId).options.peer } }
    ]);

    !graph.hasLink(peers[i].PEER, revertedIndex.get(peerId).PEER) &&
            graph.connect(peers[i].PEER, revertedIndex.get(peerId).PEER)
    totalLinks += 1
  })
  peers[i].on('close', (peerId) => {
    console.log(cy.edges().getElementById(`e${peers[i].options.peer}-${revertedIndex.get(peerId).options.peer}`));
    if(cy.edges().getElementById(`e${peers[i].options.peer}-${revertedIndex.get(peerId).options.peer}`).length>0) cy.edges().getElementById(`e${peers[i].options.peer}-${revertedIndex.get(peerId).options.peer}`).remove();
    (!peers[i].o.has(peerId)) &&
            graph.disconnect(peers[i].PEER, revertedIndex.get(peerId).PEER)
    totalLinks -= 1
  })

  // Parent
  peers[i].parent.on('open', (peerId) => {
    !graphParent.hasLink(peers[i].PEER, revertedIndex.get(peerId).PEER) &&
            graphParent.connect(peers[i].PEER, revertedIndex.get(peerId).PEER)
    totalLinksParent += 1
  })
  peers[i].parent.on('close', (peerId) => {
    (!peers[i].parent.o.has(peerId)) &&
            graphParent.disconnect(peers[i].PEER,
              revertedIndex.get(peerId).PEER)
    totalLinksParent -= 1
  })
};

function clearLineSquared(context,x1,y1,x2,y2,thickness) {
	var tmp, length;

	// swap coordinate pairs if x-coordinates are RTL to make them LTR
	if (x2 < x1) {
		tmp = x1; x1 = x2; x2 = tmp;
		tmp = y1; y1 = y2; y2 = tmp;
	}

	length = dist(x1,y1,x2,y2);

	context.save();
	context.translate(x1,y1);
	context.rotate(Math.atan2(y2-y1,x2-x1));
	context.clearRect(0,0,length,thickness);
	context.restore();
}

let scramble = (delay = 0) => {
  for (let i = 0; i < N; ++i) {
    setTimeout((nth) => {
      peers[nth]._exchange() // force exchange
    }, i * delay, i)
  };
}

var cloud = () => {
  let result = []
  for (let i = 0; i < N; ++i) {
    peers[i].getPeers().forEach((neighbor) => {
      let d = Math.abs(peers[i].options.descriptor.x -
                     revertedIndex.get(neighbor).options.descriptor.x) / N
      result.push(d)
    })
  };
  return result.sort((a, b) => a - b)
}
