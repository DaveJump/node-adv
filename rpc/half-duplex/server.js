const net = require('net')
const CAT_NAMES = require('../cats').CAT_NAMES

// create tcp server
const server = net.createServer(socket => {
  socket.on('data', function (buffer) {
    // read an int32 data from buffer
    const nameId = buffer.readInt32BE()

    setTimeout(() => {
      // broadcast data
      socket.write(Buffer.from(CAT_NAMES[nameId]))
    }, 500)
  })
})

const port = 4000

server.listen(port, function () {
  console.log(`server listening at http://127.0.0.1:${port}`)
})