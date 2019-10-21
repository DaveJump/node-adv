const net = require('net')
const CAT_IDS = require('../cats').CAT_IDS

// create socket
const socket = new net.Socket({})

socket.connect({
  host: '127.0.0.1',
  port: 4000
})

getCatIdAndPostData()

// receive response
socket.on('data', buffer => {
  console.log(buffer.toString())
  getCatIdAndPostData()
})

function getCatIdAndPostData() {
  let idx = Math.floor(Math.random() * CAT_IDS.length)
  // post data to server
  socket.write(encode(idx))
}

/**
 * encode prepost data
 */
function encode(index) {
  const buffer = Buffer.alloc(4)
  buffer.writeInt32BE(CAT_IDS[index])
  return buffer
}
