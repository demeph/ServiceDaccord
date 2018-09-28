const T = require('tman-wrtc');


let graph = new window.P2PGraph('.graph')

let N = 9

// #1 create N peers
let peers = []
let revertedIndex = new Map()

newtman = (x,y) => {
    return new T({peer: `Peer${Math.round(Math.random()*20+1)} (${x},${y})`,
        descriptor: {x: x, y:y},
        delta: 1 * 1000,
        config: {trickle: true},
        ranking: (neighbor) => (a, b) => {

            const da = (
                Math.sqrt(
                    Math.pow((a.descriptor.x - neighbor.descriptor.x),2) +
                    Math.pow((a.descriptor.y - neighbor.descriptor.y),2)
                ))
            const db = (
                Math.sqrt(
                    Math.pow((b.descriptor.x - neighbor.descriptor.x),2) +
                    Math.pow((b.descriptor.y - neighbor.descriptor.y),2)
                ))

            return (da-db)
        }
    })
}


peers.push(newtman(0,0))
revertedIndex.set(peers[0].NI.PEER, peers[0])

peers.push(newtman(0,1))
revertedIndex.set(peers[1].NI.PEER, peers[1])

peers.push(newtman(0,2))
revertedIndex.set(peers[2].NI.PEER, peers[2])

peers.push(newtman(10,10))
revertedIndex.set(peers[3].NI.PEER, peers[3])

peers.push(newtman(10,11))
revertedIndex.set(peers[4].NI.PEER, peers[4])

peers.push(newtman(10,12))
revertedIndex.set(peers[5].NI.PEER, peers[5])

peers.push(newtman(5,12))
revertedIndex.set(peers[6].NI.PEER, peers[6])

peers.push(newtman(5,5))
revertedIndex.set(peers[7].NI.PEER, peers[7])

peers.push(newtman(4,12))
revertedIndex.set(peers[8].NI.PEER, peers[8])


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

for (let i = 0; i < N; ++i) {
    console.log(peers[i]);
  graph.add({
    id: peers[i].PEER,
    me: false,
    name: peers[i].options.peer
  })

  peers[i].on('open', (peerId) => {
    !graph.hasLink(peers[i].PEER, revertedIndex.get(peerId).PEER) &&
            graph.connect(peers[i].PEER, revertedIndex.get(peerId).PEER)
    totalLinks += 1
  })
  peers[i].on('close', (peerId) => {
    (!peers[i].o.has(peerId)) &&
            graph.disconnect(peers[i].PEER, revertedIndex.get(peerId).PEER)
    totalLinks -= 1
  })
};

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
